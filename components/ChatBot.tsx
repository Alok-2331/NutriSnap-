
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, User, Loader2, Trash2, ArrowLeft, Heart, Zap, Apple } from 'lucide-react';
import { streamChatResponse } from '../geminiService';
import { UserProfile, ChatMessage } from '../types';

interface ChatBotProps {
  profile: UserProfile;
  history: ChatMessage[];
  onUpdateHistory: (history: ChatMessage[]) => void;
  onClearHistory: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ profile, history, onUpdateHistory, onClearHistory }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, currentResponse]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const newUserMsg: ChatMessage = {
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    const newHistory = [...history, newUserMsg];
    onUpdateHistory(newHistory);
    setInput('');
    setIsTyping(true);
    setCurrentResponse('');

    let fullAIResponse = '';
    try {
      await streamChatResponse(newHistory, profile, (chunk) => {
        fullAIResponse += chunk;
        setCurrentResponse(fullAIResponse);
      });

      const newAIMsg: ChatMessage = {
        role: 'model',
        text: fullAIResponse,
        timestamp: Date.now()
      };
      onUpdateHistory([...newHistory, newAIMsg]);
      setCurrentResponse('');
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        role: 'model',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now()
      };
      onUpdateHistory([...newHistory, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { label: "High protein snacks?", icon: <Zap size={14} /> },
    { label: "Is coffee healthy?", icon: <Apple size={14} /> },
    { label: "My calorie goal today?", icon: <Heart size={14} /> }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-in slide-in-from-right duration-500">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-t-[2rem] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-sm font-black">NutriAI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Online Expert</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClearHistory} 
          className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-zinc-950/50 hide-scrollbar border-x border-zinc-100 dark:border-zinc-800">
        {history.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-[2rem] flex items-center justify-center">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Hello, {profile.name}!</h3>
              <p className="text-xs text-zinc-500 px-12 leading-relaxed">
                I'm your AI health coach. Ask me anything about your diet, specific foods, or how to reach your <span className="text-emerald-500 font-bold">{profile.goal}</span> goal.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 w-full max-w-[240px]">
              {suggestions.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(s.label)}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-xs font-bold hover:border-emerald-500 transition-all active:scale-95 text-left"
                >
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg">
                    {s.icon}
                  </div>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-zinc-900 text-white' : 'bg-emerald-500 text-white'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-zinc-900 text-white rounded-tr-none' 
                : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {currentResponse && (
          <div className="flex justify-start animate-in fade-in">
            <div className="max-w-[85%] flex gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex-shrink-0 flex items-center justify-center shadow-sm">
                <Bot size={16} />
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] rounded-tl-none text-sm leading-relaxed shadow-sm">
                {currentResponse}
                <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse align-middle" />
              </div>
            </div>
          </div>
        )}

        {isTyping && !currentResponse && (
          <div className="flex justify-start gap-2">
             <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
               <Bot size={16} />
             </div>
             <div className="p-4 bg-white dark:bg-zinc-900 rounded-[1.5rem] rounded-tl-none flex gap-1">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-b-[2rem] shadow-2xl relative z-10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-950 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 focus-within:ring-2 ring-emerald-500/20 transition-all"
        >
          <input 
            type="text"
            placeholder="Ask about your health..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center disabled:opacity-30 active:scale-90 transition-all shadow-lg shadow-emerald-500/20"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
