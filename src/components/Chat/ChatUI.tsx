"use client";
import { ChatInput } from "@/components/ui/chat/chat-input";
import ReactMarkdown from "react-markdown";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { useEffect, useState } from "react";
import { Libre_Franklin } from 'next/font/google';
import { TypingIndicator } from "@/components/ui/typing-indicator";

const librefranklin = Libre_Franklin({
  subsets: ['latin'],
  weight: ['400','500', '700'],
  variable: '--font-libre-franklin',
  display: 'swap',
});

import {
  createNewChat,
  loadChatList,
  sendMessage,
  getChatHistory,
} from "@/lib/ChatAPI";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ChatUI({ user, token }: { user: any; token: string }) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  // const [model, setModel] = useState("meta-llama/Meta-Llama-3-8B-Instruct");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState("meta-llama/Llama-4-Scout-17B-16E-Instruct");

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await loadChatList(user.uid);
      setChatList(chats);
    };
    fetchChats();
  }, [user.uid]);

  useEffect(() => {
    if (!chatId) return;
    const fetchHistory = async () => {
      const history = await getChatHistory(token, chatId);
      setMessages(history);
    };
    fetchHistory();
  }, [chatId]);

  const handleNewChat = async () => {
    const newId = await createNewChat(token);
    setChatId(newId);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const question = input;
    setInput("");
  
    setMessages((prev) => [
      ...prev,
      { role: "user", message: question },
    ]);
    setIsTyping(true); // show typing indicator
  
    try {
      const response = await sendMessage({
        token,
        chatId: chatId ?? "",
        message: question,
        model,
        temperature,
      });
  
      setChatId(response.chat_id);
  
      setMessages((prev) => [
        ...prev,
        { role: "bot", message: response.reply },
      ]);
    } finally {
      setIsTyping(false); // hide typing indicator
    }
  };
  

  const handleChatSelect = (chat_id: string) => {
    setChatId(chat_id);
    setSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen w-screen bg-gray-900 text-gray-100 relative ${librefranklin.className}`}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-30
        w-64 border-r border-gray-700 bg-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block
        flex flex-col
      `}>
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-300 hover:bg-gray-700"
            >
              ✕
            </Button>
          </div>

          <Button
            onClick={handleNewChat}
            className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            New Chat
          </Button>

          <h3 className="font-semibold mb-2 text-sm">Your Chats</h3>
          <ul className="space-y-1">
            {chatList.map((chat) => (
              <li key={chat.chat_id}>
                <Button
                  variant="ghost"
                  onClick={() => handleChatSelect(chat.chat_id)}
                  className="w-full text-left truncate justify-start text-gray-300 hover:bg-gray-200 hover:text-gray-900 text-s p-2"
                >
                  <span className="truncate capitalize">{chat.first_question}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="p-3 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-300 hover:bg-gray-700 p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          <div className="hidden md:block" />
          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
          >
            Logout
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto border-none border-gray-700">
          <div className="max-w-3xl mx-auto p-2 md:p-3 space-y-2 md:space-y-3">
            {messages.map((m, idx) => (
              <Card
                key={idx}
                className="bg-transparent p-4 border-none text-gray-100"
              >
                {m.role === "user" ? (
                  <CardContent className="pt-0 text-end items-end bg-gray-800 p-3 px-4 rounded-2xl inline-block max-w-fit ml-auto">
                    <div className="text-base text-white prose prose-invert max-w-none">
                      <ReactMarkdown>{m.message}</ReactMarkdown>
                    </div>
                  </CardContent>
                ) : (
                  <CardContent className="pt-0">
                    <div className="text-base prose prose-invert max-w-none">
                      <MarkdownRenderer>{m.message}</MarkdownRenderer>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {isTyping && (
              <Card className="bg-transparent p-4 border-none text-gray-100">
                <CardContent className="pt-0">
                  <TypingIndicator />
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        {/* Input & Settings */}
        <div className="bg-gray-800 rounded-3xl self-center relative w-full lg:w-7/12 m-3 my-6 border-none focus-within:ring-1 focus-within:ring-ring p-1">
          <ChatInput
            placeholder="Type your message here..."
            className="min-h-12 max-h-80 resize-none rounded-lg bg-transparent border-none p-3 shadow-none focus-visible:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="flex items-center p-3 pt-0">
            <div className="w-32">
              <label className="text-xs text-gray-400 mb-1 block">Creativity: {temperature}</label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={([val]) => setTemperature(val)}
                className="text-blue-500"
              />
            </div>

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-56 bg-gray-700 border-gray-600 text-gray-100">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                <SelectItem value="meta-llama/Llama-4-Scout-17B-16E-Instruct">LLaMA 4 Scout 17B</SelectItem>
                <SelectItem value="deepseek-ai/DeepSeek-R1">DeepSeek R1</SelectItem>
                <SelectItem value="mistralai/Mixtral-8x7B-Instruct-v0.1">Mixtral 8x7B</SelectItem>
                <SelectItem value="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free">DeepSeek-R1-Distill</SelectItem>
                <SelectItem value="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free">Llama-3.3-70B</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size="sm"
              className="ml-auto gap-1.5 bg-white text-black font-medium hover:bg-gray-400 cursor-pointer"
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
