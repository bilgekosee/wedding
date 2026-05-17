"use client";

import {
  createElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

export enum Tag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  P = "p",
}

type VaporizeTextCycleProps = {
  texts: string[];
  font?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
  };
  color?: string;
  spread?: number;
  density?: number;
  animation?: {
    vaporizeDuration?: number;
    fadeInDuration?: number;
    waitDuration?: number;
  };
  direction?: "left-to-right" | "right-to-left";
  alignment?: "left" | "center" | "right";
  tag?: Tag;
};

type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  shouldFadeQuickly?: boolean;
};

type TextBoundaries = {
  left: number;
  right: number;
  width: number;
};

type FramerProps = Pick<
  VaporizeTextCycleProps,
  "texts" | "font" | "color" | "alignment"
>;

type CanvasWithBoundaries = HTMLCanvasElement & {
  textBoundaries?: TextBoundaries;
};

const emptySubscribe = () => () => {};

export default function VaporizeTextCycle({
  texts = ["Next.js", "React"],
  font = {
    fontFamily: "sans-serif",
    fontSize: "50px",
    fontWeight: 400,
  },
  color = "rgb(255, 255, 255)",
  spread = 5,
  density = 5,
  animation = {
    vaporizeDuration: 2,
    fadeInDuration: 1,
    waitDuration: 0.5,
  },
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.P,
}: VaporizeTextCycleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isInView = useIsInView(wrapperRef);
  const lastFontRef = useRef<string | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  // Ref mirrors state for the rAF loop to read without closure invalidation —
  // we never restart the loop on state changes, only on isInView changes.
  const animationStateRef = useRef<
    "static" | "vaporizing" | "fadingIn" | "waiting"
  >("static");
  const vaporizeProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  const wrapperSize = useElementSize(wrapperRef);
  const transformedDensity = transformValue(density, [0, 10], [0.3, 1], true);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const globalDpr = useMemo(() => {
    if (!isClient) return 1;
    return window.devicePixelRatio * 1.5 || 1;
  }, [isClient]);

  const animationDurations = useMemo(
    () => ({
      VAPORIZE_DURATION: (animation.vaporizeDuration ?? 2) * 1000,
      FADE_IN_DURATION: (animation.fadeInDuration ?? 1) * 1000,
      WAIT_DURATION: (animation.waitDuration ?? 0.5) * 1000,
    }),
    [
      animation.vaporizeDuration,
      animation.fadeInDuration,
      animation.waitDuration,
    ],
  );

  const fontConfig = useMemo(() => {
    const fontSize = parseInt(font.fontSize?.replace("px", "") ?? "50", 10);
    const VAPORIZE_SPREAD = calculateVaporizeSpread(fontSize);
    return {
      fontSize,
      MULTIPLIED_VAPORIZE_SPREAD: VAPORIZE_SPREAD * spread,
    };
  }, [font.fontSize, spread]);

  const memoizedUpdateParticles = useCallback(
    (particles: Particle[], vaporizeX: number, deltaTime: number) =>
      updateParticles(
        particles,
        vaporizeX,
        deltaTime,
        fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
        animationDurations.VAPORIZE_DURATION,
        direction,
        transformedDensity,
      ),
    [
      fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
      animationDurations.VAPORIZE_DURATION,
      direction,
      transformedDensity,
    ],
  );

  const memoizedRenderParticles = useCallback(
    (ctx: CanvasRenderingContext2D, particles: Particle[]) =>
      renderParticles(ctx, particles, globalDpr),
    [globalDpr],
  );

  // Kick off the cycle once the element scrolls into view; the rAF loop
  // below stays running and reads animationStateRef on every frame so it
  // never has to be torn down / rebuilt when the phase changes.
  useEffect(() => {
    if (!isInView) return;
    const id = window.setTimeout(() => {
      animationStateRef.current = "vaporizing";
    }, 0);
    return () => window.clearTimeout(id);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    let lastTime = performance.now();
    let frameId = 0;
    let waitTimerId: number | null = null;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const canvas = canvasRef.current as CanvasWithBoundaries | null;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx || !particlesRef.current.length) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (animationStateRef.current) {
        case "static":
        case "waiting": {
          memoizedRenderParticles(ctx, particlesRef.current);
          break;
        }
        case "vaporizing": {
          vaporizeProgressRef.current = Math.min(
            100,
            vaporizeProgressRef.current +
              (deltaTime * 100) /
                (animationDurations.VAPORIZE_DURATION / 1000),
          );

          const textBoundaries = canvas.textBoundaries;
          if (!textBoundaries) break;

          // Extend the sweep slightly past the measured text boundaries so
          // anti-aliased pixels at letter edges (which can sit a few px
          // outside the metric bounds) still get caught by the wave.
          const padding = 24;
          const sweepLeft = textBoundaries.left - padding;
          const sweepRight = textBoundaries.right + padding;
          const sweepWidth = sweepRight - sweepLeft;
          const progress = vaporizeProgressRef.current;
          const vaporizeX =
            direction === "left-to-right"
              ? sweepLeft + (sweepWidth * progress) / 100
              : sweepRight - (sweepWidth * progress) / 100;

          memoizedUpdateParticles(
            particlesRef.current,
            vaporizeX,
            deltaTime,
          );
          memoizedRenderParticles(ctx, particlesRef.current);

          // Advance purely on elapsed time. Lingering particles get cleared
          // when renderCanvas rebuilds the buffer for the next text.
          if (vaporizeProgressRef.current >= 100) {
            vaporizeProgressRef.current = 0;
            fadeOpacityRef.current = 0;
            animationStateRef.current = "fadingIn";
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
          break;
        }
        case "fadingIn": {
          fadeOpacityRef.current +=
            (deltaTime * 1000) / animationDurations.FADE_IN_DURATION;

          ctx.save();
          ctx.scale(globalDpr, globalDpr);
          particlesRef.current.forEach((particle) => {
            particle.x = particle.originalX;
            particle.y = particle.originalY;
            const opacity =
              Math.min(fadeOpacityRef.current, 1) * particle.originalAlpha;
            const next = particle.color.replace(
              /[\d.]+\)$/,
              `${opacity})`,
            );
            ctx.fillStyle = next;
            ctx.fillRect(
              particle.x / globalDpr,
              particle.y / globalDpr,
              1,
              1,
            );
          });
          ctx.restore();

          if (fadeOpacityRef.current >= 1) {
            fadeOpacityRef.current = 0;
            animationStateRef.current = "waiting";
            if (waitTimerId !== null) window.clearTimeout(waitTimerId);
            waitTimerId = window.setTimeout(() => {
              waitTimerId = null;
              vaporizeProgressRef.current = 0;
              resetParticles(particlesRef.current);
              animationStateRef.current = "vaporizing";
            }, animationDurations.WAIT_DURATION);
          }
          break;
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameId);
      if (waitTimerId !== null) window.clearTimeout(waitTimerId);
    };
  }, [
    isInView,
    texts.length,
    direction,
    globalDpr,
    memoizedUpdateParticles,
    memoizedRenderParticles,
    animationDurations.FADE_IN_DURATION,
    animationDurations.WAIT_DURATION,
    animationDurations.VAPORIZE_DURATION,
  ]);

  useEffect(() => {
    renderCanvas({
      framerProps: { texts, font, color, alignment },
      canvasRef,
      wrapperSize,
      particlesRef,
      globalDpr,
      currentTextIndex,
    });

    const currentFont = font.fontFamily ?? "sans-serif";
    return handleFontChange({
      currentFont,
      lastFontRef,
      canvasRef,
      wrapperSize,
      particlesRef,
      globalDpr,
      currentTextIndex,
      framerProps: { texts, font, color, alignment },
    });
  }, [
    texts,
    font,
    color,
    alignment,
    wrapperSize,
    currentTextIndex,
    globalDpr,
  ]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          minWidth: "30px",
          minHeight: "20px",
          pointerEvents: "none",
        }}
      />
      <SeoElement tag={tag} texts={texts} />
    </div>
  );
}

const SeoElement = memo(function SeoElement({
  tag = Tag.P,
  texts,
}: {
  tag: Tag;
  texts: string[];
}) {
  const style = useMemo(
    () => ({
      position: "absolute" as const,
      width: "1px",
      height: "1px",
      padding: 0,
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap" as const,
      border: 0,
      userSelect: "none" as const,
      pointerEvents: "none" as const,
    }),
    [],
  );

  const safeTag = (Object.values(Tag) as string[]).includes(tag) ? tag : "p";
  return createElement(safeTag, { style }, texts?.join(" ") ?? "");
});

function handleFontChange({
  currentFont,
  lastFontRef,
  canvasRef,
  wrapperSize,
  particlesRef,
  globalDpr,
  currentTextIndex,
  framerProps,
}: {
  currentFont: string;
  lastFontRef: RefObject<string | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  wrapperSize: { width: number; height: number };
  particlesRef: RefObject<Particle[]>;
  globalDpr: number;
  currentTextIndex: number;
  framerProps: FramerProps;
}) {
  if (currentFont !== lastFontRef.current) {
    lastFontRef.current = currentFont;

    const timeoutId = window.setTimeout(() => {
      cleanup({ canvasRef, particlesRef });
      renderCanvas({
        framerProps,
        canvasRef,
        wrapperSize,
        particlesRef,
        globalDpr,
        currentTextIndex,
      });
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      cleanup({ canvasRef, particlesRef });
    };
  }

  return undefined;
}

function cleanup({
  canvasRef,
  particlesRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  particlesRef: RefObject<Particle[]>;
}) {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (particlesRef.current) particlesRef.current = [];
}

function renderCanvas({
  framerProps,
  canvasRef,
  wrapperSize,
  particlesRef,
  globalDpr,
  currentTextIndex,
}: {
  framerProps: FramerProps;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  wrapperSize: { width: number; height: number };
  particlesRef: RefObject<Particle[]>;
  globalDpr: number;
  currentTextIndex: number;
}) {
  const canvas = canvasRef.current as CanvasWithBoundaries | null;
  if (!canvas || !wrapperSize.width || !wrapperSize.height) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = wrapperSize;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.floor(width * globalDpr);
  canvas.height = Math.floor(height * globalDpr);

  const fontSize = parseInt(
    framerProps.font?.fontSize?.replace("px", "") ?? "50",
    10,
  );
  const font = `${framerProps.font?.fontWeight ?? 400} ${
    fontSize * globalDpr
  }px ${framerProps.font?.fontFamily ?? "sans-serif"}`;
  const color = parseColor(framerProps.color ?? "rgb(153, 153, 153)");

  let textX: number;
  const textY = canvas.height / 2;
  const currentText = framerProps.texts[currentTextIndex] || "Next.js";

  if (framerProps.alignment === "center") textX = canvas.width / 2;
  else if (framerProps.alignment === "left") textX = 0;
  else textX = canvas.width;

  const { particles, textBoundaries } = createParticles(
    ctx,
    canvas,
    currentText,
    textX,
    textY,
    font,
    color,
    framerProps.alignment ?? "left",
  );

  particlesRef.current = particles;
  canvas.textBoundaries = textBoundaries;
}

function createParticles(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string,
  textX: number,
  textY: number,
  font: string,
  color: string,
  alignment: "left" | "center" | "right",
) {
  const particles: Particle[] = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = alignment;
  ctx.textBaseline = "middle";
  ctx.imageSmoothingQuality = "high";
  ctx.imageSmoothingEnabled = true;

  const ctxWithExtras = ctx as CanvasRenderingContext2D & {
    fontKerning?: string;
    textRendering?: string;
  };
  if ("fontKerning" in ctxWithExtras) ctxWithExtras.fontKerning = "normal";
  if ("textRendering" in ctxWithExtras)
    ctxWithExtras.textRendering = "geometricPrecision";

  const metrics = ctx.measureText(text);
  let textLeft: number;
  const textWidth = metrics.width;

  if (alignment === "center") textLeft = textX - textWidth / 2;
  else if (alignment === "left") textLeft = textX;
  else textLeft = textX - textWidth;

  const textBoundaries: TextBoundaries = {
    left: textLeft,
    right: textLeft + textWidth,
    width: textWidth,
  };

  ctx.fillText(text, textX, textY);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const baseDPR = 3;
  const styleWidth = parseInt(canvas.style.width || "1", 10) || 1;
  const currentDPR = canvas.width / styleWidth;
  const sampleRate = Math.max(1, Math.round(currentDPR / baseDPR));

  for (let y = 0; y < canvas.height; y += sampleRate) {
    for (let x = 0; x < canvas.width; x += sampleRate) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      if (alpha > 0) {
        const originalAlpha = (alpha / 255) * (sampleRate / currentDPR);
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
          opacity: originalAlpha,
          originalAlpha,
          velocityX: 0,
          velocityY: 0,
          angle: 0,
          speed: 0,
        });
      }
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return { particles, textBoundaries };
}

function updateParticles(
  particles: Particle[],
  vaporizeX: number,
  deltaTime: number,
  MULTIPLIED_VAPORIZE_SPREAD: number,
  VAPORIZE_DURATION: number,
  direction: string,
  density: number,
) {
  let allParticlesVaporized = true;

  particles.forEach((particle) => {
    const shouldVaporize =
      direction === "left-to-right"
        ? particle.originalX <= vaporizeX
        : particle.originalX >= vaporizeX;

    if (shouldVaporize) {
      if (particle.speed === 0) {
        particle.angle = Math.random() * Math.PI * 2;
        particle.speed =
          (Math.random() * 1 + 0.5) * MULTIPLIED_VAPORIZE_SPREAD;
        particle.velocityX = Math.cos(particle.angle) * particle.speed;
        particle.velocityY = Math.sin(particle.angle) * particle.speed;
        particle.shouldFadeQuickly = Math.random() > density;
      }

      if (particle.shouldFadeQuickly) {
        particle.opacity = Math.max(0, particle.opacity - deltaTime);
      } else {
        const dx = particle.originalX - particle.x;
        const dy = particle.originalY - particle.y;
        const distanceFromOrigin = Math.sqrt(dx * dx + dy * dy);
        const dampingFactor = Math.max(
          0.95,
          1 - distanceFromOrigin / (100 * MULTIPLIED_VAPORIZE_SPREAD),
        );
        const randomSpread = MULTIPLIED_VAPORIZE_SPREAD * 3;
        const spreadX = (Math.random() - 0.5) * randomSpread;
        const spreadY = (Math.random() - 0.5) * randomSpread;
        particle.velocityX =
          (particle.velocityX + spreadX + dx * 0.002) * dampingFactor;
        particle.velocityY =
          (particle.velocityY + spreadY + dy * 0.002) * dampingFactor;

        const maxVelocity = MULTIPLIED_VAPORIZE_SPREAD * 2;
        const currentVelocity = Math.sqrt(
          particle.velocityX * particle.velocityX +
            particle.velocityY * particle.velocityY,
        );
        if (currentVelocity > maxVelocity) {
          const scale = maxVelocity / currentVelocity;
          particle.velocityX *= scale;
          particle.velocityY *= scale;
        }

        particle.x += particle.velocityX * deltaTime * 20;
        particle.y += particle.velocityY * deltaTime * 10;

        const baseFadeRate = 0.25;
        const durationBasedFadeRate = baseFadeRate * (2000 / VAPORIZE_DURATION);
        particle.opacity = Math.max(
          0,
          particle.opacity - deltaTime * durationBasedFadeRate,
        );
      }

      if (particle.opacity > 0.01) allParticlesVaporized = false;
    } else {
      allParticlesVaporized = false;
    }
  });

  return allParticlesVaporized;
}

function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  globalDpr: number,
) {
  ctx.save();
  ctx.scale(globalDpr, globalDpr);
  particles.forEach((particle) => {
    if (particle.opacity > 0) {
      const next = particle.color.replace(
        /[\d.]+\)$/,
        `${particle.opacity})`,
      );
      ctx.fillStyle = next;
      ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1);
    }
  });
  ctx.restore();
}

function resetParticles(particles: Particle[]) {
  particles.forEach((particle) => {
    particle.x = particle.originalX;
    particle.y = particle.originalY;
    particle.opacity = particle.originalAlpha;
    particle.speed = 0;
    particle.velocityX = 0;
    particle.velocityY = 0;
  });
}

function calculateVaporizeSpread(fontSize: number) {
  const size = typeof fontSize === "string" ? parseInt(fontSize, 10) : fontSize;
  const points = [
    { size: 20, spread: 0.2 },
    { size: 50, spread: 0.5 },
    { size: 100, spread: 1.5 },
  ];
  if (size <= points[0].size) return points[0].spread;
  if (size >= points[points.length - 1].size)
    return points[points.length - 1].spread;
  let i = 0;
  while (i < points.length - 1 && points[i + 1].size < size) i++;
  const p1 = points[i];
  const p2 = points[i + 1];
  return (
    p1.spread + ((size - p1.size) * (p2.spread - p1.spread)) / (p2.size - p1.size)
  );
}

function parseColor(color: string) {
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (rgbaMatch) {
    const r = rgbaMatch[1];
    const g = rgbaMatch[2];
    const b = rgbaMatch[3];
    const a = rgbaMatch[4];
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (rgbMatch) {
    const r = rgbMatch[1];
    const g = rgbMatch[2];
    const b = rgbMatch[3];
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  return "rgba(0, 0, 0, 1)";
}

function transformValue(
  input: number,
  inputRange: number[],
  outputRange: number[],
  clamp = false,
): number {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;
  const progress = (input - inputMin) / (inputMax - inputMin);
  let result = outputMin + progress * (outputMax - outputMin);
  if (clamp) {
    if (outputMax > outputMin) {
      result = Math.min(Math.max(result, outputMin), outputMax);
    } else {
      result = Math.min(Math.max(result, outputMax), outputMin);
    }
  }
  return result;
}

function useIsInView(ref: RefObject<HTMLElement | null>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "50px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height },
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
