import { motion } from 'framer-motion';

export default function ChatMessage({ text, isBot, type }: { text: string; isBot: boolean; type: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl max-w-[80%] mb-4 transition-all duration-300 ${
        isBot 
          ? 'bg-black/30 backdrop-blur-lg ml-auto border border-blue-500/30 hover:border_blue-300' 
          : 'bg-white/30 backdrop-blur-lg border border-white/30 hover:border-white/50'
      }`}
      style={{
        animation: type === 'welcome' ? 'fadeIn 1s ease-out' : 'none'
      }}
    >
      <p className="text-white leading-relaxed font-sans">{text}</p>
      <div className="mt-1 flex items-center gap-2 text-sm">
        {!isBot && (
          <span className="text-green-400 font-semibold">Sent</span>
        )}
        <span className={`text-gray-300 font-medium ${isBot ? 'text-right' : ''}`}>
          {isBot ? "NutriBot" : "You"}
        </span>
      </div>
    </motion.div>
  );
}