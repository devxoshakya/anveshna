"use client";
import { useState, useEffect, useRef } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ChatPlaceholder } from "@/components/chat/ChatPlaceholder";
import { ChatMessages, type Message } from "@/components/chat/ChatMessages";
import { useAiChat, useAnimeIdentification } from "@/hooks/useAi";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ChatPage = () => {
  const { 
    messages: aiMessages, 
    isLoading: isAiLoading, 
    sendMessage, 
    error: aiError,
    clearMessages,
    sessionId,
    streamingMessageId
  } = useAiChat();
  const { identifyAnime, isLoading: isIdentifying, result: identificationResult, error: identifyError } = useAnimeIdentification();
  const [imageMessages, setImageMessages] = useState<Message[]>([]);
  const imageMessageCountRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Combine AI messages and image messages
  const messages: Message[] = [
    ...imageMessages,
    ...aiMessages.map((msg, index) => {
      const messageId = `${msg.timestamp.getTime()}-${index}`;
      const isLastMessage = index === aiMessages.length - 1;
      const isStreaming = isLastMessage && msg.role === 'assistant' && isAiLoading;
      
      return {
        id: messageId,
        content: msg.content,
        timestamp: msg.timestamp,
        role: msg.role,
        isStreaming,
      };
    })
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Auto-scroll to bottom when messages change or during streaming
  useEffect(() => {
    if (chatContainerRef.current && isAiLoading) {
      // Smooth scroll during streaming
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAiLoading]);

  const handleSendMessage = async (message: string, files?: File[], mode?: 'search' | 'recommendation' | 'chat') => {
    if (!message.trim() && (!files || files.length === 0)) return;

    // In search mode, require image to be present
    if (mode === 'search' && (!files || files.length === 0)) {
      console.log("Search mode requires an image to be uploaded");
      return;
    }

    try {
      // Handle based on the mode
      if (mode === 'search' && files && files.length > 0) {
        // Search mode with image - use identifyAnime
        const imageFile = files[0];
        
        // Add user message with image info
        const userMessage: Message = {
          id: Date.now().toString(),
          content: message || "What anime is this?",
          files: files,
          timestamp: new Date(),
          role: "user",
        };
        setImageMessages((prev) => [...prev, userMessage]);

        // Identify the anime from the image
        const result = await identifyAnime(imageFile);
        
        if (result.success && result.result) {
          const animeInfo = result.result;
          const responseContent = `🎬 **${animeInfo.anime}**\n\n${animeInfo.overview}\n\n📺 **Episodes:** ${animeInfo.episodes}\n🎭 **Genres:** ${animeInfo.genres.join(", ")}\n⭐ **Confidence:** ${animeInfo.confidence}\n\n**Review:**\n${animeInfo.review}`;
          
          const aiMessage: Message = {
            id: `${Date.now()}-ai`,
            content: responseContent,
            timestamp: new Date(),
            role: "assistant",
            animeData: result,
          };
          setImageMessages((prev) => [...prev, aiMessage]);
        }
      } else if (mode === 'recommendation') {
        // Recommendation mode - placeholder (still in works)
        const userMessage: Message = {
          id: Date.now().toString(),
          content: message,
          timestamp: new Date(),
          role: "user",
        };
        setImageMessages((prev) => [...prev, userMessage]);

        const aiMessage: Message = {
          id: `${Date.now()}-ai`,
          content: "🚧 The recommendation feature is currently under development. Stay tuned for personalized anime recommendations!",
          timestamp: new Date(),
          role: "assistant",
        };
        setImageMessages((prev) => [...prev, aiMessage]);
      } else if (mode === 'chat') {
        // Chat mode - use AI chat with streaming
        await sendMessage(message);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  const handleNewChat = () => {
    clearMessages(true); // true = create new session
    setImageMessages([]); // clear image messages too
  };

  const isLoading = isAiLoading || isIdentifying;

  return (
    <div className="flex flex-col mt-10 w-full h-[92vh] mx-0">
      {/* Header with New Chat button */}
      {messages.length > 0 && (
        <div className="px-4 md:px-8 pb-2 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-0 no-scrollbar"
      >
        <div className="max-w-4xl mx-auto h-full">
          {messages.length === 0 ? (
            <ChatPlaceholder />
          ) : (
            <>
              <ChatMessages messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-0 md:p-8 pb-20 md:pb-8 pt-4 backdrop-blur-md bg-background/50">
        <div className="max-w-4xl mx-auto w-full px-0 md:px-4">
          <PromptInputBox onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
