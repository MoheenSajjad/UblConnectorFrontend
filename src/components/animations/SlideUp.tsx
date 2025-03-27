import React from "react";
import { motion } from "framer-motion";
import { AnimationEase } from "@/types/animations";

type SlideUpProps = {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  ease?: AnimationEase;
};

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  duration = 0.5,
  distance = 10,
  ease = AnimationEase.EaseInOut,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease }}
    >
      {children}
    </motion.div>
  );
};
