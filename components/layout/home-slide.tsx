import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";
import { Tv, Subtitles, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const SkeletonSlide = () => {
  return (
    <div className="w-full h-64 rounded-lg bg-muted-foreground animate-pulse">
      <div className="h-full w-full flex flex-col justify-end p-6">
        <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
        <div className="h-16 bg-muted rounded w-3/5"></div>
      </div>
    </div>
  );
};

interface HomeCarouselProps {
  data: any[];
  loading: boolean;
  error?: string | null;
}

export const HomeCarousel = ({ data, loading, error }: HomeCarouselProps) => {
  const router = useRouter();
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const validData = data.filter(
    (item: any) =>
      item.title && item.title.english && item.description && item.cover !== item.image
  );

  const handlePlayButtonClick = (id: string) => {
    router.push(`/watch/${id}`);
  };

  const handleDetailsClick = (id: string) => {
    router.push(`/details/${id}`);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validData.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + validData.length) % validData.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (validData.length > 0) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      setAutoplayInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [validData.length]);

  if (loading) return <SkeletonSlide />;

  console.log("Valid Data:", validData);

  if (validData.length === 0) {

    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        No content available
      </div>
    );
  }

  const currentItem = validData[currentIndex];

  return (
    <div className="relative w-full">
      <div className="relative md:h-96 h-72 w-full rounded-lg overflow-hidden bg-black/5">
        <img
          src={currentItem.cover}
          alt={currentItem.title.english || currentItem.title.romaji + " Banner Image"}
          className="absolute w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent"></div>

        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="pl-6 mt-auto">
            <Card className="flex flex-row items-center gap-1 px-1 py-1 rounded-full w-fit border-1 backdrop-blur-sm">
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20 !shadow-none">
                <Tv className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">TV</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20">
                <Subtitles className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">49</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20">
                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">73</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">24 mins</span>
              </Badge>
            </Card>
          </div>

          <div className="p-6 flex md:flex-row flex-col justify-between items-start md:items-end text-start">
            <div className="max-w-5xl">
              <h2 className="text-white md:text-4xl text-2xl left-0 font-bold text-shadow"
              style={{color: currentItem.color}}
              >
                {currentItem.title.english}
              </h2>
              <div className="text-white/80 text-sm mt-2 max-h-16 overflow-hidden">
                <div className="line-clamp-2 hidden md:block" dangerouslySetInnerHTML={{ __html: currentItem.description }} />
              </div>
            </div>
            <div className="right-6 bottom-4 flex items-end justify-end space-x-4 mt-4 md:mt-0">
              <Button
                onClick={() => handleDetailsClick(currentItem.id)}
                variant="outline"
                className="flex items-center gap-2 border-1 shadow-sm"
              >
                <BiInfoCircle />
                DETAILS
              </Button>

              <Button
                onClick={() => handlePlayButtonClick(currentItem.id)}
                variant="default"
                className="flex items-center gap-2 border-1 shadow-sm"
              >
                <FaPlay />
                WATCH NOW
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex space-x-2 cursor-pointer">
          <Button onClick={handlePrevious} size="icon" variant="secondary" className="bg-muted border-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#983D70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button onClick={handleNext} size="icon" variant="secondary" className="bg-muted border-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#983D70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};
