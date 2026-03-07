"use client";
import { useState, useEffect, useRef } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ChatPlaceholder } from "@/components/chat/ChatPlaceholder";
import { ChatMessages, type Message } from "@/components/chat/ChatMessages";
import { useAiChat, useAnimeIdentification, useAnimeRecommendation } from "@/hooks/useAi";

const ChatPage = () => {
  const { 
    messages: aiMessages, 
    isLoading: isAiLoading, 
    sendMessage  } = useAiChat();
  const { identifyAnime, isLoading: isIdentifying } = useAnimeIdentification();
  const { getRecommendations, isLoading: isGettingRecommendations } = useAnimeRecommendation();
  const [imageMessages, setImageMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Track context from search/recommendation for chat mode
  const lastContextRef = useRef<string | null>(null);
  const useContextOnNextChatRef = useRef<boolean>(false);

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
          // animeData will be displayed by SearchResultCard component in ChatMessages
          const aiMessage: Message = {
            id: `${Date.now()}-ai`,
            content: "", // Content will be handled by SearchResultCard
            timestamp: new Date(),
            role: "assistant",
            animeData: result,
          };
          setImageMessages((prev) => [...prev, aiMessage]);
          
          // Store context for potential chat mode switch
          const animeInfo = result.result;
          const contextInfo = `The user just searched for an anime using an image. The identified anime is: "${animeInfo.anime}" (AniList ID: ${result.id}). It has ${animeInfo.episodes} episodes and belongs to genres: ${animeInfo.genres.join(', ')}. Overview: ${animeInfo.overview}`;
          lastContextRef.current = contextInfo;
          useContextOnNextChatRef.current = true;
        } else {
          // Error handling
          const aiMessage: Message = {
            id: `${Date.now()}-ai`,
            content: result.error || "Sorry, I couldn't identify this anime. Please try a different image.",
            timestamp: new Date(),
            role: "assistant",
          };
          setImageMessages((prev) => [...prev, aiMessage]);
        }
      } else if (mode === 'recommendation') {
        // Recommendation mode - get anime recommendations
        const userMessage: Message = {
          id: Date.now().toString(),
          content: message,
          timestamp: new Date(),
          role: "user",
        };
        setImageMessages((prev) => [...prev, userMessage]);

        const result = await getRecommendations(message);
        
        if (result.success && result.recommendation && result.recommendation.length > 0) {
          // Pass recommendation data to be rendered as cards
          const aiMessage: Message = {
            id: `${Date.now()}-ai`,
            content: "", // Content will be handled by recommendation card grid
            timestamp: new Date(),
            role: "assistant",
            recommendationData: result,
          };
          setImageMessages((prev) => [...prev, aiMessage]);
          
          // Store context for potential chat mode switch
          const topRecommendations = result.recommendation
            .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5)
            .map((rec: any) => `"${rec.title.english || rec.title.romaji}" (Rating: ${rec.rating}/100, ${rec.episodes} episodes)`)
            .join(', ');
          const contextInfo = `The user just asked for anime recommendations based on: "${message}". The top recommended anime are: ${topRecommendations}. These recommendations are sorted by rating score.`;
          lastContextRef.current = contextInfo;
          useContextOnNextChatRef.current = true;
        } else {
          const aiMessage: Message = {
            id: `${Date.now()}-ai`,
            content: "Sorry, I couldn't find any recommendations. Please try a different anime title.",
            timestamp: new Date(),
            role: "assistant",
          };
          setImageMessages((prev) => [...prev, aiMessage]);
        }
      } else if (mode === 'chat') {
        // Chat mode - use AI chat with streaming
        let messageToSend = message;
        
        // If switching from search/recommendation mode, add context
        if (useContextOnNextChatRef.current && lastContextRef.current) {
          messageToSend = `[Context from previous interaction: ${lastContextRef.current}]\n\nUser's question: ${message}`;
          // Clear the context flag after using it once
          useContextOnNextChatRef.current = false;
        }
        
        await sendMessage(messageToSend);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      // Display error as a chat message
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        content: `❌ An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        role: "assistant",
      };
      setImageMessages((prev) => [...prev, errorMessage]);
    }
  };

  const isLoading = isAiLoading || isIdentifying || isGettingRecommendations;

  return (
    <div className="flex flex-col mt-10 w-full h-[92vh] mx-0">
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
