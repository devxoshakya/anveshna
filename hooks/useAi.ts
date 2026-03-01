import { useState, useCallback, useEffect } from 'react';

// Types
export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GenerateTextRequest {
  prompt: string;
  sessionId: string;
}

export interface GenerateTextResponse {
  response: string;
}

// Session Management
const SESSION_STORAGE_KEY = 'ai-chat-session-id';
const SESSION_TIMESTAMP_KEY = 'ai-chat-session-timestamp';
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate a unique session ID
 */
const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Get or create a session ID from localStorage
 * Automatically clears session if older than 24 hours
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return generateSessionId();
  
  const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  const storedTimestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
  
  // Check if session exists and is still valid
  if (storedSessionId && storedTimestamp) {
    const timestamp = parseInt(storedTimestamp, 10);
    const now = Date.now();
    
    // If session is less than 24 hours old, return it
    if (now - timestamp < SESSION_EXPIRY_MS) {
      return storedSessionId;
    }
    
    // Session expired, clear it
    console.log('[Session] Session expired after 24 hours, creating new session');
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
  }
  
  // Create new session
  const newSessionId = generateSessionId();
  localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
  return newSessionId;
};

/**
 * Clear the stored session ID (starts a new conversation)
 */
export const clearSessionId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
  }
};

export interface AnimeIdentificationResult {
  success: boolean;
  id?: number;
  result?: {
    anilist_id: number;
    anime: string;
    overview: string;
    episodes: number;
    genres: string[];
    review: string;
    confidence: 'High' | 'Medium' | 'Low';
  };
  media?: any;
  error?: string;
}

export interface AnimeRecommendation {
  id: number;
  malId: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes: number;
  image: string;
  imageHash: string;
  cover: string;
  coverHash: string;
  rating: number;
  type: string;
}

export interface AnimeRecommendationResult {
  success: boolean;
  id?: string;
  recommendation?: AnimeRecommendation[];
  error?: string;
}

// Get API URL from environment
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_AI_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_AI_API_URL is not defined in environment variables');
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * Hook for AI chat/text generation
 * Handles conversation history and streaming responses
 */
export const useAiChat = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  /**
   * Generate text with streaming support
   * @param prompt - User's message
   * @param onChunk - Callback for each text chunk received (optional)
   */
  const generateText = useCallback(async (
    prompt: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, sessionId } as GenerateTextRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate text: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      console.log('[Streaming] Starting to read chunks...');
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log(`[Streaming] Complete! Received ${chunkCount} chunks, total length: ${fullText.length}`);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        chunkCount++;
        
        if (chunkCount <= 5 || chunkCount % 10 === 0) {
          console.log(`[Streaming] Chunk ${chunkCount}: "${chunk.substring(0, 50)}..."`);
        }
        
        // Call the callback for real-time updates
        if (onChunk) {
          onChunk(chunk);
        }
      }

      return fullText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate text';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  /**
   * Send a message and receive streaming response
   */
  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately
    const userMessage: AiChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Create placeholder for AI response
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: AiChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      // Stream the AI response
      let fullResponse = '';
      let lastUpdateTime = Date.now();
      const UPDATE_INTERVAL = 50; // Update UI every 50ms minimum
      let updateCount = 0;
      
      console.log('[sendMessage] Starting to generate text...');
      
      await generateText(content, (chunk) => {
        fullResponse += chunk;
        
        const now = Date.now();
        // Throttle updates to avoid too many re-renders while still showing streaming
        if (now - lastUpdateTime >= UPDATE_INTERVAL) {
          lastUpdateTime = now;
          updateCount++;
          
          if (updateCount <= 5 || updateCount % 5 === 0) {
            console.log(`[sendMessage] Update ${updateCount}: ${fullResponse.length} chars`);
          }
          
          // Update the AI message in real-time
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                content: fullResponse,
              };
            }
            return newMessages;
          });
        }
      });

      console.log(`[sendMessage] Complete! Total updates: ${updateCount}, final length: ${fullResponse.length}`);

      // Final update to ensure all content is shown
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: fullResponse,
          };
        }
        return newMessages;
      });

      setStreamingMessageId(null);
      return fullResponse;
    } catch (err) {
      // Remove the placeholder message on error
      setMessages((prev) => prev.slice(0, -1));
      setStreamingMessageId(null);
      
      // Add error message
      const errorMessage: AiChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      console.error('Error sending message:', err);
      throw err;
    }
  }, [generateText]);

  /**
   * Clear all messages and optionally start a new session
   */
  const clearMessages = useCallback((createNewSession: boolean = false) => {
    setMessages([]);
    setError(null);
    setStreamingMessageId(null);
    
    if (createNewSession) {
      clearSessionId();
      setSessionId(getSessionId());
    }
  }, []);

  const deleteMessage = useCallback((index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    streamingMessageId,
    sendMessage,
    generateText,
    clearMessages,
    deleteMessage,
  };
};

/**
 * Hook for anime identification from images
 * Handles image upload and identification
 */
export const useAnimeIdentification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnimeIdentificationResult | null>(null);

  const identifyAnime = useCallback(async (imageFile: File): Promise<AnimeIdentificationResult> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = getApiUrl();
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${apiUrl}/identify-anime`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to identify anime: ${response.statusText}`);
      }

      const data: AnimeIdentificationResult = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to identify anime');
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to identify anime';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const identifyAnimeFromUrl = useCallback(async (imageUrl: string): Promise<AnimeIdentificationResult> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch image from URL
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image from URL');
      }

      const blob = await imageResponse.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });

      return await identifyAnime(file);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to identify anime from URL';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [identifyAnime]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    identifyAnime,
    identifyAnimeFromUrl,
    reset,
  };
};

/**
 * Hook for anime recommendations
 * Handles getting anime recommendations based on a prompt
 */
export const useAnimeRecommendation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnimeRecommendationResult | null>(null);

  const getRecommendations = useCallback(async (prompt: string): Promise<AnimeRecommendationResult> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = getApiUrl();
      
      const response = await fetch(`${apiUrl}/recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get recommendations: ${response.statusText}`);
      }

      const data: AnimeRecommendationResult = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    getRecommendations,
    reset,
  };
};

/**
 * Standalone function to generate text with streaming (can be used with React's use())
 * @param prompt - User's message
 * @param sessionId - Optional session ID (generates new one if not provided)
 * @param onChunk - Optional callback for streaming chunks
 */
export const generateAiText = async (
  prompt: string,
  sessionId?: string,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    const apiUrl = getApiUrl();
    const sid = sessionId || getSessionId();
    
    const response = await fetch(`${apiUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, sessionId: sid } as GenerateTextRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate text: ${response.statusText}`);
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      
      if (onChunk) {
        onChunk(chunk);
      }
    }

    return fullText;
  } catch (err) {
    console.error('Error generating AI text:', err);
    throw err;
  }
};

/**
 * Standalone function to identify anime (can be used with React's use())
 */
export const identifyAnimeFromImage = async (imageFile: File): Promise<AnimeIdentificationResult> => {
  try {
    const apiUrl = getApiUrl();
    
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${apiUrl}/identify-anime`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to identify anime: ${response.statusText}`);
    }

    const data: AnimeIdentificationResult = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to identify anime');
    }

    return data;
  } catch (err) {
    console.error('Error identifying anime:', err);
    throw err;
  }
};
