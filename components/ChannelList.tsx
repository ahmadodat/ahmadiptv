import React from 'react';
import { Channel } from '../types';
import Icon from './Icon';

interface ChannelListProps {
  channels: Channel[];
  currentChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, currentChannel, onSelectChannel, favorites, onToggleFavorite }) => {
  if (channels.length === 0) {
    return <div className="p-4 text-center text-gray-500">No channels found.</div>;
  }

  return (
    <ul className="divide-y divide-gray-800/50">
      {channels.map((channel, index) => {
        const isSelected = currentChannel?.id === channel.id;
        const isFavorite = favorites.includes(channel.id);
        return (
          <li key={channel.id}>
            <button
              onClick={() => onSelectChannel(channel)}
              className={`w-full text-left p-4 flex items-center gap-4 transition duration-150 ease-in-out focus:outline-none focus:bg-gray-800/30 ${
                isSelected
                  ? 'bg-[#8A1538]'
                  : 'hover:bg-gray-800/40'
              }`}
            >
              <span className={`text-base font-mono flex-shrink-0 w-8 text-center ${
                isSelected ? 'text-white font-bold' : 'text-gray-500'
              }`}>
                {String(index + 1).padStart(3, '0')}
              </span>
              <img 
                src={channel.logo} 
                alt={`${channel.name} logo`} 
                className="w-12 h-12 rounded-md object-contain bg-black/20 flex-shrink-0"
                onError={(e) => (e.currentTarget.src = 'https://i.imgur.com/8z5g5c7.png')}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-lg font-semibold truncate ${
                  isSelected ? 'text-white' : 'text-gray-200'
                }`}>
                  {channel.name}
                </p>
                <p className={`text-sm truncate ${
                  isSelected ? 'text-red-200' : 'text-gray-400'
                }`}>
                  {channel.group}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(channel.id);
                }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Icon name={isFavorite ? 'star' : 'star-outline'} className={`w-6 h-6 ${isFavorite ? 'text-amber-400' : 'text-gray-500'}`} />
              </button>
            </button>
          </li>
        )
      })}
    </ul>
  );
};

export default ChannelList;