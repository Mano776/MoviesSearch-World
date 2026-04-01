import { motion } from "motion/react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      />
      <p className="text-blue-400 font-medium animate-pulse">Fetching movies...</p>
    </div>
  );
}
