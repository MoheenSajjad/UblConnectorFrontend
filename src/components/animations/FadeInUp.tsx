import { AnimationEase } from "@/types/animations";
import { motion } from "framer-motion";

interface FadeInUpProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  ease?: AnimationEase;
  scale?: number;
  className?: string;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  duration = 0.5,
  distance = 10,
  scale = 1,
  ease = AnimationEase.EaseInOut,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance, scale }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
