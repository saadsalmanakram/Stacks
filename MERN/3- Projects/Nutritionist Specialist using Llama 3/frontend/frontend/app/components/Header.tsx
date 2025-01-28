import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 shadow-lg fixed w-full top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent transition-all duration-500 hover:scale-105 hover:shadow-lg"
        >
          NutriChat
        </motion.h1>
        
        <nav className="flex gap-6 items-center">
          <a href="https://github.com/saadsalmanakram" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">
            Github
          </a>
          <a href="https://huggingface.co/SaadSalman7" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">
            Hugging Face
          </a>
          <a href="https://www.linkedin.com/in/saadsalmanakram/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">
            Linkedin
          </a>
        </nav>
      </div>
    </header>
  );
}
