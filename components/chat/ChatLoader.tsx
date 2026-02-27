"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { DitherShader } from "@/components/ui/dither-shader";

export const ChatLoader = () => {
  const [gridSize, setGridSize] = useState(2.1);
  const motionValue = useMotionValue(1.1);

  useEffect(() => {
    const controls = animate(motionValue, 4.5, {
      duration: 2.5,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
      onUpdate: (latest) => {
        setGridSize(latest);
      },
    });

    return () => controls.stop();
  }, [motionValue]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        className="relative w-32 h-32 md:w-40 md:h-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1 }}
      >
        <DitherShader
          src="/pippo.png"
          gridSize={gridSize}
          ditherMode="bayer"
          colorMode="original"
          brightness={0.1}
          contrast={1.2}
          objectFit="contain"
          className="w-full h-full"
        />
      </motion.div>
    </div>
  );
};
