import { motion } from 'framer-motion';

export default function ChatMessage({ text, isBot }: { text: string; isBot: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl max-w-[80%] ${isBot ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 ml-auto' : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'}`}
    >
      <p className="text-white leading-relaxed">{text}</p>
      {!isBot && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-blue-400">Sent</span>
          <span className="text-xs text-purple-400">Now</span>
        </div>
      )}
    </motion.div>
  );
}