import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-blue-900 h-20">
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-bold text-white opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              NutriChat
            </span>
            <p className="text-lg text-gray-300 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
              Empowering healthier tomorrows, one message at a time
            </p>
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 mix-blend-soft-light opacity-20"></div>
      </div>
    </footer>
  );
}
