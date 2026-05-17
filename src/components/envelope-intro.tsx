"use client";

import { useEffect, useRef, useState } from "react";

import { FloatingFlowers } from "@/components/floating-flowers";
import { cn } from "@/lib/utils";

type Stage = "closed" | "open" | "raised" | "done";

const PULL_THRESHOLD = 80;
const PULL_MAX = 240;

export function EnvelopeIntro({ onDone }: { onDone?: () => void }) {
  const [stage, setStage] = useState<Stage>("closed");
  const [unmounted, setUnmounted] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isDragging) return;

    let lastDragY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (dragStartRef.current === null) return;
      const delta = dragStartRef.current - e.clientY;
      lastDragY = Math.min(PULL_MAX, Math.max(0, delta));
      setDragY(lastDragY);
    };
    const onMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      setDragY(0);
      if (lastDragY >= PULL_THRESHOLD) setStage("raised");
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  if (unmounted) return null;

  const finish = () => {
    setStage("done");
    window.setTimeout(() => {
      setUnmounted(true);
      onDone?.();
    }, 700);
  };

  const releaseDrag = () => {
    const pulled = dragY;
    setIsDragging(false);
    dragStartRef.current = null;
    setDragY(0);
    if (pulled >= PULL_THRESHOLD) setStage("raised");
  };

  const startDrag = (clientY: number) => {
    if (stage !== "open") return;
    dragStartRef.current = clientY;
    setIsDragging(true);
  };

  const handleEnvelopeClick = () => {
    if (stage === "closed") setStage("open");
  };

  const handleLetterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stage === "open") {
      e.preventDefault();
      startDrag(e.clientY);
    }
  };

  const onLetterTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (stage === "open") {
      startDrag(e.touches[0]?.clientY ?? 0);
    }
  };

  const onLetterTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (stage !== "open" || dragStartRef.current === null) return;
    e.preventDefault();
    const clientY = e.touches[0]?.clientY ?? 0;
    const delta = dragStartRef.current - clientY;
    setDragY(Math.min(PULL_MAX, Math.max(0, delta)));
  };

  const onLetterTouchEnd = () => {
    if (stage === "open") {
      releaseDrag();
    }
  };

  const handleLetterClick = (e: React.MouseEvent) => {
    if (stage === "raised") {
      e.stopPropagation();
      finish();
    }
  };

  const isFlapOpen = stage !== "closed";
  const isRaised = stage === "raised" || stage === "done";
  const isDone = stage === "done";

  const letterStyle: React.CSSProperties = {
    transform: isRaised
      ? "translateY(-105%)"
      : stage === "open" || isDragging
        ? `translateY(${-dragY}px)`
        : "translateY(0px)",
    transition: isDragging
      ? "none"
      : "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease-out",
    touchAction: stage === "open" ? "none" : undefined,
  };

  const hintLabel =
    stage === "closed"
      ? "açmak için dokun"
      : stage === "open"
        ? "kağıdı yukarı çek"
        : "devam etmek için dokun";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-sage-deep px-6 py-10 transition-opacity duration-700",
        isDone && "pointer-events-none opacity-0",
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(138,161,122,0.35), transparent 60%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.4), transparent 60%)",
      }}
    >
      <FloatingFlowers count={18} seed={3} />
      <div className="relative">
        <div
          role={stage === "closed" ? "button" : undefined}
          tabIndex={stage === "closed" ? 0 : -1}
          onClick={handleEnvelopeClick}
          onKeyDown={(e) => {
            if (stage === "closed" && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleEnvelopeClick();
            }
          }}
          aria-label={stage === "closed" ? "Davetiyeyi aç" : undefined}
          className={cn(
            "relative aspect-[3/2] w-72 select-none bg-cream-soft sm:w-100",
            "shadow-[inset_0_0_30px_-5px_var(--color-muted),0_30px_60px_-15px_rgba(0,0,0,0.45)]",
            "transition-transform duration-700 focus:outline-none",
            stage === "closed" && "cursor-pointer",
            isFlapOpen && "transform-[translateY(4px)_scale(0.99)]",
          )}
        >
          <div
            role={isRaised ? "button" : undefined}
            tabIndex={isRaised ? 0 : -1}
            aria-label={isRaised ? "Devam et" : undefined}
            onClick={handleLetterClick}
            onPointerDown={handleLetterPointerDown}
            onTouchStart={onLetterTouchStart}
            onTouchMove={onLetterTouchMove}
            onTouchEnd={onLetterTouchEnd}
            onKeyDown={(e) => {
              if (isRaised && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                finish();
              }
            }}
            style={letterStyle}
            className={cn(
              "absolute inset-x-4 inset-y-3 flex flex-col items-center justify-center gap-3 bg-paper px-5 py-6 text-center text-ink sm:inset-x-8 sm:inset-y-4",
              "shadow-[inset_0_0_20px_-6px_var(--color-paper-shadow),0_15px_30px_-10px_rgba(0,0,0,0.4)]",
              dragY > 0 || isRaised ? "z-[5]" : "z-[1]",
              stage === "closed" && "pointer-events-none opacity-0",
              stage !== "closed" && "opacity-100",
              stage === "open" && "cursor-grab touch-none active:cursor-grabbing",
              isRaised && "cursor-pointer",
            )}
          >
            <span
              aria-hidden
              className="font-serif text-base italic leading-none text-sage-deep/70 sm:text-lg"
            >
              ❦
            </span>
            <p className="font-serif text-[13px] italic leading-snug text-ink-soft sm:text-sm">
              Hayatımızın en güzel
              <br />
              hikâyesine davetlisiniz
            </p>
            <p className="font-script text-2xl leading-none text-ink sm:text-4xl">
              Fatma Nur
              <span className="px-1.5 font-serif text-lg italic font-normal text-sage-deep sm:text-2xl">
                &amp;
              </span>
              Salih
            </p>
            <span className="font-serif text-[10px] italic uppercase tracking-[0.3em] text-muted sm:text-xs">
              04.07.2026 · Mersin
            </span>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="absolute top-[10%] left-[-65%] aspect-square w-full rotate-45 bg-cream-soft shadow-[0_0_30px_-5px_var(--color-muted)]" />
            </div>
            <div className="absolute inset-0">
              <div className="absolute top-[10%] right-[-65%] aspect-square w-full rotate-45 bg-cream-soft shadow-[0_0_30px_-5px_var(--color-muted)]" />
            </div>
            <div className="absolute inset-0">
              <div className="absolute top-[60%] left-0 aspect-square w-full rotate-45 rounded-[5rem] bg-cream-soft shadow-[0_0_30px_-5px_var(--color-muted)]" />
            </div>
          </div>

          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-[3] h-[71%] w-full origin-top overflow-hidden transition-[transform] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
              isFlapOpen && "perspective-[10px] transform-[rotateX(-180deg)]",
            )}
          >
            <div className="absolute bottom-7.5 left-0 aspect-square w-full rotate-45 rounded-[5rem] bg-cream-soft shadow-[0_0_30px_-5px_var(--color-muted)] sm:bottom-14.5" />
          </div>

          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-1/2 top-[70%] z-[4] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sage-deep font-serif text-cream shadow-[inset_0_-3px_6px_rgba(0,0,0,0.25),0_6px_12px_rgba(0,0,0,0.3)] transition-all duration-700 sm:h-20 sm:w-20",
              isFlapOpen && "scale-50 opacity-0",
            )}
          >
            <span className="text-base italic sm:text-xl">
              F<span className="not-italic opacity-80">&amp;</span>S
            </span>
          </span>
        </div>

        <span
          aria-hidden
          className={cn(
            "absolute left-1/2 z-[7] -translate-x-1/2 whitespace-nowrap text-center font-script text-cream transition-all duration-500",
            "-bottom-14 text-base opacity-80 sm:-bottom-17.5 sm:text-lg",
          )}
        >
          {hintLabel}
        </span>

        <span
          aria-hidden
          className={cn(
            "absolute -bottom-19.5 left-1/2 z-[7] inline-block h-1.5 w-1.5 -translate-x-1/2 animate-pulse rounded-full bg-cream/80 sm:-bottom-24",
          )}
        />
      </div>
    </div>
  );
}
