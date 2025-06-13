"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeSlideInProps {
  children: ReactNode;
  delay?: number;
  reverse?: boolean;
  className?: string;
}

const FadeSlideIn = ({
  children,
  className,
  reverse,
  delay,
}: FadeSlideInProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
        duration: 0.2,
        delay,
        ease: "easeInOut",
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeSlideIn;
