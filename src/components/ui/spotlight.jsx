"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export const Spotlight = ({
  children,
  className,
  fill,
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener("mousemove", handleMouseMove);
      div.addEventListener("mouseenter", handleFocus);
      div.addEventListener("mouseleave", handleBlur);

      return () => {
        div.removeEventListener("mousemove", handleMouseMove);
        div.removeEventListener("mouseenter", handleFocus);
        div.removeEventListener("mouseleave", handleBlur);
      };
    }
  }, []);

  return (
    <div
      ref={divRef}
      className={cn(
        "relative overflow-hidden rounded-md border border-slate-800 bg-slate-950",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${fill}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}; 