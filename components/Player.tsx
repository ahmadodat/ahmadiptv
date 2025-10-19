import React, { useEffect, useRef } from 'react';
import { Channel } from '../types';
import Icon from './Icon';

declare const Hls: any;

interface PlayerProps {
  channel: Channel | null;
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
}

const Player: React.FC<PlayerProps> = ({ channel, channels, onSelectChannel, favorites, onToggleFavorite }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const cleanup = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (videoElement) {
        videoElement.pause();
        videoElement.removeAttribute('src');
        videoElement.load();
      }
    };

    if (videoElement && channel) {
      cleanup(); // Clean up previous instance before setting up new one
      const sourceUrl = channel.url;
      if (sourceUrl.includes('.m3u8')) {
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
          const hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
          });
          hlsRef.current = hls;

          hls.loadSource(sourceUrl);
          hls.attachMedia(videoElement);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play().catch(e => console.error("Autoplay prevented by browser", e));
          });

          hls.on(Hls.Events.ERROR, (event: any, data: any) => {
            if (data.fatal) {
              console.error('HLS.js fatal error:', data.type, data.details);
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.warn('HLS.js network error, trying to recover...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.warn('HLS.js media error, trying to recover...');
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
          videoElement.src = sourceUrl;
          videoElement.addEventListener('loadedmetadata', () => {
            videoElement.play().catch(e => console.error("Native HLS autoplay prevented", e));
          });
        }
      } else {
        videoElement.src = sourceUrl;
        videoElement.play().catch(e => console.error("Autoplay prevented for non-HLS stream", e));
      }
    }

    return cleanup;
  }, [channel]);
  
  const handleNextChannel = () => {
    if (!channel || channels.length === 0) return;
    const currentIndex = channels.findIndex(ch => ch.id === channel.id);
    if (currentIndex === -1) {
      if (channels.length > 0) onSelectChannel(channels[0]);
      return;
    };
    const nextIndex = (currentIndex + 1) % channels.length;
    onSelectChannel(channels[nextIndex]);
  };

  const handlePreviousChannel = () => {
    if (!channel || channels.length === 0) return;
    const currentIndex = channels.findIndex(ch => ch.id === channel.id);
    if (currentIndex === -1) {
       if (channels.length > 0) onSelectChannel(channels[0]);
       return;
    }
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    onSelectChannel(channels[prevIndex]);
  };
  
  const isFavorite = channel ? favorites.includes(channel.id) : false;

  return (
    <div className="flex-1 flex flex-col bg-black">
      {channel ? (
        <>
          <div className="flex-1 bg-black relative group">
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full object-contain"
              key={channel.id}
            />
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button 
                onClick={handlePreviousChannel}
                className="p-3 bg-black/50 rounded-full hover:bg-[#8A1538] focus:outline-none focus:ring-2 focus:ring-white pointer-events-auto"
                aria-label="Previous channel"
              >
                <Icon name="back" className="w-8 h-8 text-white" />
              </button>
              <button 
                onClick={handleNextChannel}
                className="p-3 bg-black/50 rounded-full hover:bg-[#8A1538] focus:outline-none focus:ring-2 focus:ring-white pointer-events-auto"
                aria-label="Next channel"
              >
                <Icon name="chevron-right" className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 bg-[#1E1E1E] border-t border-gray-800/50 p-4">
            <div className="flex items-center gap-4">
              <img 
                src={channel.logo} 
                alt={`${channel.name} logo`} 
                className="w-16 h-16 rounded-md object-contain bg-black/20 flex-shrink-0"
                onError={(e) => (e.currentTarget.src = 'https://i.imgur.com/8z5g5c7.png')}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white truncate">{channel.name}</h2>
                <p className="text-base text-gray-400">{channel.group}</p>
              </div>
              <button
                onClick={() => onToggleFavorite(channel.id)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Icon name={isFavorite ? 'star' : 'star-outline'} className={`w-8 h-8 ${isFavorite ? 'text-amber-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-center text-gray-400">
            <Icon name="tv" className="w-32 h-32 mx-auto" />
            <p className="mt-6 text-3xl font-semibold">Select a channel to play</p>
            <p className="text-lg text-gray-500">Choose a category and channel from the lists on the left.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;