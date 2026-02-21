
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await getGeminiResponse(messages, input);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Failed to get response from Gemini:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 z-50"
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
                    <header className="bg-gray-800 text-white p-4 flex items-center justify-between rounded-t-lg">
                        <div className="flex items-center">
                            <Bot className="mr-2" />
                            <h3 className="font-semibold">Registration Assistant</h3>
                        </div>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-sm text-gray-500">
                                Ask me anything about the land registration process!
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-2.5 my-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && <div className="p-2 bg-green-700 text-white rounded-full"><Bot size={16}/></div>}
                                <div className={`flex flex-col gap-1 max-w-[320px] p-2 border-gray-200 rounded-lg ${msg.role === 'user' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <p className="text-sm font-normal text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                                {msg.role === 'user' && <div className="p-2 bg-gray-200 rounded-full"><User size={16}/></div>}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-2.5 my-2">
                                <div className="p-2 bg-green-700 text-white rounded-full"><Bot size={16}/></div>
                                <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                                    <Loader className="animate-spin h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <footer className="p-2 border-t bg-white">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your question..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="ml-2 bg-green-700 text-white p-2 rounded-full hover:bg-green-800 disabled:bg-gray-400"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

export default GeminiAssistant;
