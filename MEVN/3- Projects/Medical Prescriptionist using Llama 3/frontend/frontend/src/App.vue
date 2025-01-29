<template>
  <header>
    <h1 class="app-title">PharmaGenie</h1>
    <nav>
      <a href="https://github.com/saadsalmanakram" class="nav-link">Github</a>
      <a href="https://huggingface.co/SaadSalman7" class="nav-link">HuggingFace</a>
      <a href="https://www.linkedin.com/in/saadsalmanakram/" class="nav-link">Linkedin</a>
    </nav>
  </header>

  <main>
    <div class="chat-container">
      <div class="chat-header">
        <h2>AI Assistant</h2>
        <div class="ai-logo">AI</div>
        <div class="floating-elements">
          <div class="floating circ" style="--i:0;"></div>
          <div class="floating circ" style="--i:1;"></div>
          <div class="floating circ" style="--i:2;"></div>
        </div>
      </div>

      <div class="messages-container">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.sender]">
          <p class="message-text">{{ message.text }}</p>
          <span class="timestamp">{{ message.timestamp }}</span>
        </div>
      </div>

      <div class="input-container">
        <input type="text" 
               placeholder="Type your message here..." 
               v-model="inputMessage">
        <button class="send-btn">
          <span class="btn-icon">AI</span>
        </button>
        <div class="floating-elements">
          <div class="floating circ" style="--i:3;"></div>
          <div class="floating circ" style="--i:4;"></div>
          <div class="floating circ" style="--i:5;"></div>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <p>&copy; 2025 PharmaGenie. All rights reserved.</p>
  </footer>
</template>

<script>
import { ref } from 'vue';

export default {
  data() {
    return {
      inputMessage: '',
      messages: [
        { text: "Hello! How can I help you?", sender: 'AI', timestamp: 'Now' },
        { text: "I want to analyze some pharmacological data", sender: 'user', timestamp: '2m ago' }
      ]
    }
  },
  methods: {
    sendMessage() {
      if (this.inputMessage.trim()) {
        this.messages.push({
          text: this.inputMessage,
          sender: 'user',
          timestamp: 'Now'
        });
        this.inputMessage = '';
        
        // AI response simulation
        setTimeout(() => {
          this.messages.push({
            text: "Analyzing your data, please wait a moment...",
            sender: 'AI',
            timestamp: 'Now'
          });
        }, 1000);
      }
    }
  },
  mounted() {
    // Initialize event listener for Enter key
    document.querySelector('input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }
}
</script>