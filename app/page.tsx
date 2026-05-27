"use client";
import { motion } from "framer-motion";
import BottomRightCorner from "@/components/ui/bottom-right-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const fadeUp = (delay: number, y: number = 16, duration: number = 0.6) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: "easeOut" as const },
});

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            switch (e.key) {
                case "Enter":
                    router.push("/search?sort=POPULARITY_DESC&type=ANIME");
                    break;
                case "h":
                case "H":
                    router.push("/home");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);
    return (
        <section className="w-full min-h-screen p-2 md:p-3 bg-[#f0f0f0]">
            <div className="relative w-full h-[calc(100vh-16px)] md:h-[calc(100vh-24px)] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
                >
                    <source
                        src="https://cdn2.devxoshakya.xyz/landing/compressed_bg.mp4"
                        type="video/mp4"
                    />
                </video>

                <div className="relative z-20 w-full h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center px-4 md:px-8 text-center">
                        <div className="flex flex-col items-center w-full max-w-3xl">
                            <motion.img
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                src="/loader.png"
                                alt="Anveshna logo"
                                className="w-64 sm:w-72 md:w-96 lg:w-108 h-auto mb-4 md:mb-6 opacity-90"
                            />
                            <motion.h1
                                {...fadeUp(0.1, 16, 0.6)}
                                className="relative inline-block border-1 border-blue-100 px-4 py-3 md:px-6 md:py-4 backdrop-blur-[5px] text-center font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] font-extralight tracking-tight text-white max-w-5xl"
                            >
                                Built to{" "}
                                <em
                                    className="italic text-white/90 font-extralight"
                                    style={{ fontStyle: "italic" }}
                                >
                                    understand
                                </em>{" "}
                                what anime feels like before you even press
                                play.
                                <span className="absolute aspect-square h-1 bg-white z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
                                <span className="absolute aspect-square h-1 bg-white z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2" />
                                <span className="absolute aspect-square h-1 bg-white z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                                <span className="absolute aspect-square h-1 bg-white z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                            </motion.h1>

                            <motion.p
                                {...fadeUp(0.1, 16, 0.6)}
                                className="relative inline-block border-[0.5px] border-blue-100 px-3 py-1 md:px-4 my-2 backdrop-blur-lg text-center font-extralight font-[family-name:var(--font-instrument-serif)] text-base sm:text-lg md:text-xl lg:text-2xl leading-[0.95] tracking-tight text-white max-w-3xl"
                            >
                                Discover, stream, and explore your favorite
                                anime — all in one tranquil place.
                                <span className="absolute aspect-square h-1 bg-white z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
                                <span className="absolute aspect-square h-1 bg-white z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2" />
                                <span className="absolute aspect-square h-1 bg-white z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                                <span className="absolute aspect-square h-1 bg-white z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                            </motion.p>

                            <motion.div
                                className="flex gap-2 md:gap-4 justify-center items-center my-6 md:my-8 md:max-w-md mx-auto"
                                {...fadeUp(0.2, 20, 0.6)}
                            >
                                <Button
                                    className="gap-2 text-sm md:text-base whitespace-nowrap transition-all duration-300"
                                    asChild
                                >
                                    <Link
                                        className="flex group items-center gap-2"
                                        href="/search?sort=POPULARITY_DESC&type=ANIME"
                                    >
                                        <span>Search Anime</span>
                                        <Badge className="bg-accent p-1 text-foreground transition-all duration-200 ease-in-out group-hover:shadow-xl shadow-background/70">
                                            <CornerDownLeft className="size-4" />
                                        </Badge>
                                    </Link>
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="gap-2 text-sm md:text-base whitespace-nowrap transition-all duration-300"
                                >
                                    <Link
                                        className="flex group items-center gap-2"
                                        href="/home"
                                    >
                                        <span>Watch Now</span>
                                        <Badge className="bg-accent text-foreground transition-all duration-200 group-hover:shadow-xl shadow-white/70">
                                            H
                                        </Badge>
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    <BottomRightCorner />
                </div>
            </div>
        </section>
    );
}
