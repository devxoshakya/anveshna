import { ImagesBadge } from "@/components/ui/images-badge";
import { ChatLoader } from "@/components/chat/ChatLoader";

export const ChatPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Character Image */}
        <div className="relative w-full max-w-md mx-auto">
          <img
            src="/watari.svg"
            alt="Watari character"
            className="w-full h-64 md:h-80 object-contain"
          />
        </div>
        
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            Welcome to Anveshna
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
            Your AI-powered anime companion. Discover, explore, and chat about your favorite anime series.
          </p>
        </div>

        {/* Images Badge Section */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <ImagesBadge
            text="Explore Anime Collection"
            images={[
              "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
              "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg",
              "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-CXtrrkMpJ8Zq.jpg",
            ]}
            className="scale-125"
            folderSize={{ width: 48, height: 36 }}
            teaserImageSize={{ width: 32, height: 22 }}
            hoverImageSize={{ width: 72, height: 48 }}
            hoverTranslateY={-50}
            hoverSpread={30}
            hoverRotation={20}
          />
          
          <p className="text-sm text-muted-foreground">
            Start chatting to get personalized anime recommendations
          </p>
        </div>

        {/* Start message hint */}
        <div className="pt-6">
          <p className="text-xs md:text-sm text-muted-foreground/80">
            Type your message below to begin your anime journey
          </p>
        </div>

        
      </div>
    </div>
  );
};
