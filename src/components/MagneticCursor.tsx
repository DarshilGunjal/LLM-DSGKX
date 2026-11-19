"use client";

import { useEffect, useRef, useState } from "react";

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only enable custom cursor on fine pointer devices (desktop)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");
    setIsVisible(true);

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check hovered interactive elements
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, [data-cursor]");
      if (interactive) {
        setIsHovered(true);
        const customText = interactive.getAttribute("data-cursor") || "";
        setCursorText(customText);
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    const onMouseDown = () => setIsDragging(true);
    const onMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let animationFrameId: number;
    const render = () => {
      // Smooth interpolation for follower ring
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Laser Point */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-[#FF3B00] pointer-events-none z-[99999] transition-transform duration-75"
        style={{ willChange: "transform" }}
      />

      {/* Swiss Neo-Brutalist Outer Crosshair Reticle */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99998] flex items-center justify-center transition-all duration-200 ease-out ${
          isHovered
            ? "w-16 h-16 -ml-8 -mt-8 border-2 border-[#FF3B00] bg-[#FF3B00]/10"
            : isDragging
            ? "w-10 h-10 -ml-5 -mt-5 border border-[#F2EFE9] bg-[#F2EFE9]/20"
            : "w-8 h-8 -ml-4 -mt-4 border border-[#F2EFE9]/50"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Subtle Crosshairs in Reticle */}
        <span className="absolute -top-1.5 text-[10px] text-[#FF3B00] font-mono leading-none">+</span>
        <span className="absolute -bottom-1.5 text-[10px] text-[#FF3B00] font-mono leading-none">+</span>
        <span className="absolute -left-1.5 text-[10px] text-[#FF3B00] font-mono leading-none">+</span>
        <span className="absolute -right-1.5 text-[10px] text-[#FF3B00] font-mono leading-none">+</span>

        {cursorText && (
          <span className="absolute whitespace-nowrap -bottom-6 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest bg-[#0B0B0C] border border-[#FF3B00] text-[#FF3B00] uppercase">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
