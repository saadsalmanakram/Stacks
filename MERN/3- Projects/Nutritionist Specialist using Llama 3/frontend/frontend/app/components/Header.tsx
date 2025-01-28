import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          NutriChat
        </motion.h1>
        
        <nav className="flex gap-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}