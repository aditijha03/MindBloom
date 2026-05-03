import { useState, useEffect, useRef } from 'react';
import useBloomBotStore from '../../store/useBloomBotStore';
import styles from './BloomBot.module.css';
import { Send } from 'lucide-react';

const ChatInterface = () => {
  const { history, isTyping, sendMessage, startSession, userType } = useBloomBotStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // If parent and no history, start session immediately
    if (userType === 'parent' && history.length === 0) {
      startSession();
    }
  }, [userType, history.length, startSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <>
      <div className={styles.contentArea}>
        {history.map((msg, idx) => (
          <div 
            key={idx} 
            className={`${styles.chatMessage} ${msg.role === 'assistant' ? styles.msgAssistant : styles.msgUser}`}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.chatMessage} ${styles.msgAssistant}`}>
            <span className="typing-dots">Bloom is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className={styles.inputArea}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </>
  );
};

export default ChatInterface;
