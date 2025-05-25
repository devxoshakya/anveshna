import React, { useState } from 'react';
import {
  FaMicrophone,
  FaClosedCaptioning,
  FaBell,
  FaDownload,
  FaShare,
} from 'react-icons/fa';

// Props interface
interface MediaSourceProps {
  serverName: string;
  setServerName: (serverName: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  downloadLink: string;
  episodeId?: string;
  airingTime?: string;
  nextEpisodenumber?: string;
}

export const MediaSource: React.FC<MediaSourceProps> = ({
  serverName,
  setServerName,
  language,
  setLanguage,
  downloadLink,
  episodeId,
  airingTime,
  nextEpisodenumber,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="flex justify-center mt-4 gap-4 max-lg:flex-col ">
      {/* Episode Info Column */}
      <div className="flex-grow  bg-card border-2 border-border rounded-lg p-3 max-lg:mr-0">
        {episodeId ? (
          <>
            <h4 className="text-lg font-bold mb-4 max-sm:text-base max-sm:mb-0">
              You're watching <strong>Episode {episodeId}</strong>
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center ml-2 p-2 gap-1 text-sm font-bold border-none rounded-lg cursor-pointer bg-card text-card-foreground text-center no-underline transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95"
              >
                <FaDownload className="text-xs" />
              </a>
              <button
                onClick={handleShareClick}
                className="inline-flex items-center ml-2 p-2 gap-1 text-sm font-bold border-none rounded-lg cursor-pointer bg-card text-card-foreground no-underline transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95"
              >
                <FaShare className="text-xs" />
              </button>
            </h4>
            {isCopied && <p className="text-sm m-0">Copied to clipboard!</p>}
            
            <p className="text-sm m-0 max-sm:text-xs">
              If current servers don't work, please try other servers.
            </p>
          </>
        ) : (
          <p className="text-sm m-0 max-sm:text-xs">Loading episode information...</p>
        )}
        {airingTime && (
          <p className="text-sm m-0 max-sm:text-xs">
            Episode <strong>{nextEpisodenumber}</strong> will air in{' '}
            <FaBell className="inline" />
            <strong> {airingTime}</strong>.
          </p>
        )}
      </div>

      {/* Media Source Selection */}
      <div className="bg-card border-2 border-border rounded-lg p-4 max-sm:block">
        {/* Sub Row */}
        <div className="flex items-center gap-2 mb-4 ">
          <div className="flex items-center gap-2 min-w-16 ">
            <FaClosedCaptioning className="max-sm:mb-0" />
            <span className="font-bold">Sub</span>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 border-none font-bold rounded-lg cursor-pointer transition-all duration-200 text-center hover:scale-105 active:scale-95 ${
                serverName === 'vidcloud' && language === 'sub'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent'
              }`}
              onClick={() => {
                setServerName('vidcloud');
                setLanguage('sub');
              }}
            >
              Vidcloud
            </button>
            <button
              className={`px-4 py-2 border-none font-bold rounded-lg cursor-pointer transition-all duration-200 text-center hover:scale-105 active:scale-95 ${
                serverName === 'vidstreaming' && language === 'sub'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent'
              }`}
              onClick={() => {
                setServerName('vidstreaming');
                setLanguage('sub');
              }}
            >
              Vidstream
            </button>
          </div>
        </div>

        {/* Dub Row */}
        <div className="flex items-center gap-4 ">
          <div className="flex items-center gap-2 min-w-16 ">
            <FaMicrophone className="max-sm:mb-0" />
            <span className="font-bold">Dub</span>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 border-none font-bold rounded-lg cursor-pointer transition-all duration-200 text-center hover:scale-105 active:scale-95 ${
                serverName === 'vidcloud' && language === 'dub'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent'
              }`}
              onClick={() => {
                setServerName('vidcloud');
                setLanguage('dub');
              }}
            >
              Vidcloud
            </button>
            <button
              className={`px-4 py-2 border-none font-bold rounded-lg cursor-pointer transition-all duration-200 text-center hover:scale-105 active:scale-95 ${
                serverName === 'vidstreaming' && language === 'dub'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent'
              }`}
              onClick={() => {
                setServerName('vidstreaming');
                setLanguage('dub');
              }}
            >
              Vidstream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};