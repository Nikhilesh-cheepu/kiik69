"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const cardsBreakpoints = content.map((_, index) => index / cardLength);
      const setActiveIndex = cardsBreakpoints.findIndex(
        (breakpoint) => breakpoint > latest
      );
      setActiveCard(setActiveIndex === -1 ? cardLength : setActiveIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, cardLength, content]);

  const backgroundColors = [
    "from-slate-900 to-slate-800",
    "from-slate-800 to-slate-900",
    "from-slate-900 to-slate-800",
    "from-slate-800 to-slate-900",
  ];

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-md bg-slate-950 py-10 md:py-20"
    >
      <div className="relative flex items-start justify-center w-full">
        <div className="w-full max-w-4xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.4,
                  y: activeCard === index ? 0 : 50,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                }}
                className={cn(
                  "sticky top-4 z-10 rounded-lg border border-slate-800 bg-slate-900 p-8 opacity-40",
                  contentClassName
                )}
              >
                {item.content}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 