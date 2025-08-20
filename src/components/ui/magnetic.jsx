"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Magnetic = ({
  children,
  className,
  speed = 0.5,
  tolerance = 0.8,
  axis = "both",
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      const maxDistance = Math.max(rect.width, rect.height) * tolerance;

      if (distance < maxDistance) {
        const x = (e.clientX - centerX) * speed;
        const y = (e.clientY - centerY) * speed;
        setPosition({ x, y });
        setIsHovered(true);
      } else {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [speed, tolerance]);

  const getTransform = () => {
    const x = axis === "both" || axis === "x" ? position.x : 0;
    const y = axis === "both" || axis === "y" ? position.y : 0;
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  );
}; 