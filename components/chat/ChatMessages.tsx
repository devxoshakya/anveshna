interface Message {
  id: string;
  content: string;
  files?: File[];
  timestamp: Date;
  role: "user" | "assistant";
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <div className="space-y-4 px-4 md:px-0">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex justify-end"
        >
          <div className="max-w-[80%] md:max-w-[70%] bg-primary text-primary-foreground rounded-2xl px-4 py-3">
            <p className="text-sm md:text-base">{msg.content}</p>
            {msg.files && msg.files.length > 0 && (
              <p className="text-xs mt-2 opacity-80">
                {msg.files.length} file(s) attached
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export type { Message };
