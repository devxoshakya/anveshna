"use client";

/**
 * @author: @kokonutui
 * @description: AI Loading State
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import AITextLoading from "./ai-text-loading";

type LoadingMode = "search" | "recommendation" | "chat";

const LOADING_TEXTS = {
    search: [
        "Searching anime ...",
    ],
    recommendation: [
        "recommendations ...",
    ],
    chat: [
        "Thinking stuff ...",
    ],
};

const TASK_SEQUENCES = [
    {
        status: "Searching anime...",
        lines: [
            "Initializing search engine...",
            "Connecting to anime databases...",
            "Scanning AniList and MyAnimeList...",
            "Querying metadata repositories...",
            "Analyzing image vectors and patterns...",
            "Cross-referencing with visual database...",
            "Matching character designs and scenes...",
            "Verifying anime titles and episodes...",
            "Extracting detailed information...",
            "Compiling comprehensive results...",
            "Finalizing search results...",
        ],
    },
    {
        status: "Finding recommendations...",
        lines: [
            "Analyzing your anime preferences...",
            "Processing viewing history patterns...",
            "Identifying favorite genres and themes...",
            "Scanning recommendation algorithms...",
            "Cross-referencing similar titles...",
            "Evaluating ratings and reviews...",
            "Matching your taste profile...",
            "Filtering by content quality...",
            "Ranking by compatibility score...",
            "Preparing personalized suggestions...",
            "Finalizing recommendation list...",
        ],
    },
    {
        status: "Thinking...",
        lines: [
            "Processing your question...",
            "Understanding query context...",
            "Analyzing anime knowledge base...",
            "Retrieving relevant information...",
            "Cross-referencing anime data...",
            "Evaluating multiple sources...",
            "Generating comprehensive response...",
            "Structuring answer format...",
            "Verifying accuracy and details...",
            "Finalizing response content...",
            "Preparing to respond...",
        ],
    },
];

interface AILoadingStateProps {
    mode?: LoadingMode;
}

export default function AILoadingState({ mode = "search" }: AILoadingStateProps) {
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [visibleLines, setVisibleLines] = useState<
        Array<{ text: string; number: number }>
    >([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const lineHeight = 28;

    const currentSequence = TASK_SEQUENCES[sequenceIndex];
    const totalLines = currentSequence.lines.length;

    useEffect(() => {
        const initialLines = [];
        for (let i = 0; i < Math.min(5, totalLines); i++) {
            initialLines.push({
                text: currentSequence.lines[i],
                number: i + 1,
            });
        }
        setVisibleLines(initialLines);
        setScrollPosition(0);
    }, [sequenceIndex, currentSequence.lines, totalLines]);

    // Handle line advancement
    useEffect(() => {
        const advanceTimer = setInterval(() => {
            // Get the current first visible line index
            const firstVisibleLineIndex = Math.floor(
                scrollPosition / lineHeight
            );
            const nextLineIndex = (firstVisibleLineIndex + 3) % totalLines;

            // If we're about to wrap around, move to next sequence
            if (nextLineIndex < firstVisibleLineIndex && nextLineIndex !== 0) {
                setSequenceIndex(
                    (prevIndex) => (prevIndex + 1) % TASK_SEQUENCES.length
                );
                return;
            }

            // Add the next line if needed
            if (
                nextLineIndex >= visibleLines.length &&
                nextLineIndex < totalLines
            ) {
                setVisibleLines((prevLines) => [
                    ...prevLines,
                    {
                        text: currentSequence.lines[nextLineIndex],
                        number: nextLineIndex + 1,
                    },
                ]);
            }

            // Scroll to the next line
            setScrollPosition((prevPosition) => prevPosition + lineHeight);
        }, 3000); // Slightly slower than the example for better readability

        return () => clearInterval(advanceTimer);
    }, [
        scrollPosition,
        visibleLines,
        totalLines,
        sequenceIndex,
        currentSequence.lines,
        lineHeight,
    ]);

    // Apply scroll position
    useEffect(() => {
        if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = scrollPosition;
        }
    }, [scrollPosition]);

    return (
        <div className="flex items-center justify-center min-h-full w-full">
            <div className="space-y-4 w-auto">
                <div className="ml-2 flex justify-start items-center gap-1">
                    <div className="relative w-32 h-32">
                        <Image
                            src="/pippo.png"
                            alt="Loading"
                            width={1080}
                            height={1080}
                            className="object-contain"
                        />
                    </div>
                    <AITextLoading
                        texts={LOADING_TEXTS[mode]}
                        className="text-2xl"
                        interval={1500}
                    />
                </div>

                <div className="relative">
                    <div
                        ref={codeContainerRef}
                        className="font-mono text-sm overflow-hidden px-0.5 w-full h-21 relative rounded-lg"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        <div>
                            {visibleLines.map((line, index) => (
                                <div
                                    key={`${line.number}-${line.text}`}
                                    className="flex h-7 items-center px-2"
                                >
                                    <div className="text-gray-400 dark:text-gray-500 pr-3 select-none w-6 text-right">
                                        {line.number}
                                    </div>

                                    <div className="text-gray-800 dark:text-gray-200 flex-1 ml-1">
                                        {line.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none rounded-lg from-white/90 via-white/50 to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent"
                        style={{
                            background:
                                "linear-gradient(to bottom, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 30%, var(--tw-gradient-to) 100%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
