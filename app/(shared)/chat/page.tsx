"use client";
import { useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ChatPlaceholder } from "@/components/chat/ChatPlaceholder";
import { ChatMessages, type Message } from "@/components/chat/ChatMessages";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      files: files,
      timestamp: new Date(),
      role: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    
    // TODO: Here you would typically send the message to your AI backend
    console.log("Message:", message);
    console.log("Files:", files);
  };

  return (
    <div className="flex flex-col mt-10 w-full h-[92vh] mx-0 border-8 border-lime-400 ">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto  p-0 md:p-8 pt-4 pb-0">
        <div className="max-w-4xl mx-auto h-full">
          {messages.length === 0 ? (
            <ChatPlaceholder />
          ) : (
            <ChatMessages messages={messages} />
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-0 md:p-8 pb-20 md:pb-8 pt-4 ">
        <div className="max-w-4xl mx-auto w-full px-0 md:px-4">
          <PromptInputBox onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
