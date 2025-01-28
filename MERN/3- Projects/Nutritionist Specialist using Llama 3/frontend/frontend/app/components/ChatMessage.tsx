import { motion } from 'framer-motion';

export default function ChatMessage({ text, isBot }: { text: string; isBot: boolean }) {
  // Example bot responses
  const getBotReply = (incomingText: string) => {
    const replies = {
      "hello": "Hello! How can I help you today?",
      "thank you": "You're welcome!",
      "help": "I'm here to help. What do you need assistance with?",
      "bye": "Goodbye! Have a great day!",
    };
    const lowerText = incomingText.toLowerCase();
    return replies[lowerText as keyof typeof replies] || "I'm not sure. Could you please clarify?";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl max-w-[80%] ${
        isBot 
         ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 ml-auto' 
          : 'bg-gradient-to-r from-yellow-500/20 to-pink-500/20'
      }`}
    >
      <p className="text-white leading-relaxed">{text}</p>
      <div className="mt-1 flex items-center gap-2 text-sm">
        {!isBot && (
          <span className="text-yellow-400 font-semibold">Sent</span>
        )}
        <span className="text-gray-300">
          {isBot? "Bot" : "You"}
        </span>
      </div>
    </motion.div>
  );
}