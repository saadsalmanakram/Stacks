import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-blue-900 h-20">
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-bold text-white opacity-90">NutriChat</span>
            <p className="text-sm text-gray-300">Connecting the future, one message at a time</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">
            Resources
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">
            Legal
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">
            Social Media
          </a>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 mix-blend-soft-light opacity-20"></div>
      </div>
    </footer>
  );
}