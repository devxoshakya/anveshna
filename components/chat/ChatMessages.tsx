import ReactMarkdown from "react-markdown";
import type { AnimeIdentificationResult, AnimeRecommendationResult } from "@/hooks/useAi";
import { ChatLoader } from "./ChatLoader";
import { SearchResultCard } from "./SearchResultCard";
import { CardGrid } from "@/components/cards/CardGrid";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Message {
  id: string;
  content: string;
  files?: File[];
  timestamp: Date;
  role: "user" | "assistant";
  animeData?: AnimeIdentificationResult;
  recommendationData?: AnimeRecommendationResult;
  isStreaming?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6 px-2">
      {messages.map((msg) => {
        const hasFiles = msg.files && msg.files.length > 0;
        const hasContent = msg.content && msg.content.trim().length > 0;
        const hasAnimeData = msg.animeData && msg.role === "assistant";
        const hasRecommendationData = msg.recommendationData && msg.role === "assistant";
        
        return (
          <div key={msg.id} className="w-full space-y-3">
            {/* Display attached images as full images */}
            {hasFiles && (
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                <div className={`${msg.role === "user" ? "max-w-[70%] md:max-w-[55%]" : "max-w-[85%]"} flex flex-col gap-2`}>
                  {msg.files!.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full rounded-2xl object-contain max-h-96"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display SearchResultCard for anime identification results */}
            {hasAnimeData && msg.animeData && (
              <div className="flex justify-start w-full">
                <div className="max-w-[95%] w-full">
                  <SearchResultCard result={msg.animeData} />
                </div>
              </div>
            )}
            
            {/* Display Recommendations */}
            {hasRecommendationData && msg.recommendationData && msg.recommendationData.recommendation && (
              <div className="flex justify-start w-full">
                <div className="max-w-[95%] w-full space-y-4">
                  <div className="text-xl md:text-2xl font-bold text-foreground">
                    Anime Recommendations.
                  </div>
                  <CardGrid 
                    animeData={msg.recommendationData.recommendation
                      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
                      .slice(0, isMobile ? 9 : 12)
                      .map((rec: any) => ({
                        id: rec.id,
                        title: {
                          romaji: rec.title?.romaji,
                          english: rec.title?.english,
                          native: rec.title?.native,
                          userPreferred: rec.title?.userPreferred || rec.title?.romaji,
                        },
                        image: rec.image || rec.cover,
                        cover: rec.cover || rec.image,
                        color: rec.color,
                        status: rec.status,
                        releaseDate: rec.releaseDate || rec?.seasonYear?.toString() || rec?.startDate?.year?.toString(),
                        totalEpisodes: rec.episodes,
                        rating: rec.rating,
                        type: rec.type,
                      }))}
                    hasNextPage={false}
                    onLoadMore={() => {}}
                  />
                </div>
              </div>
            )}
            
            {/* Display message content only if there's text and no anime data and no recommendation data */}
            {hasContent && !hasAnimeData && !hasRecommendationData && (
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                <div
                  className={`${msg.role === "user" ? "max-w-[70%] md:max-w-[55%]" : "max-w-[85%]"} rounded-2xl ${
                    msg.role === "user" 
                      ? "px-4 py-3" 
                      : "px-0 py-0 md:px-4 md:py-3"
                  } ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground"
                  }`}
                >
                  {/* Message content with markdown support */}
                  <div className="text-sm md:text-base prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 my-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        code: ({ children }) => (
                          <code className="bg-muted/50 px-1 py-0.5 rounded text-xs">{children}</code>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                    
                    {/* Streaming cursor indicator */}
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start w-full">
          <div className="max-w-[85%] rounded-2xl px-0 py-0 md:px-4 md:py-3 bg-background text-foreground">
            <ChatLoader />
          </div>
        </div>
      )}
    </div>
  );
};
