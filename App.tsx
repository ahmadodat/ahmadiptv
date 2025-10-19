import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Channel, Category, IconName } from './types';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import ChannelList from './components/ChannelList';
import Player from './components/Player';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';

const parseM3u = (m3uContent: string): { channels: Channel[]; categories: Category[] } => {
  const lines = m3uContent.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      const infoLine = line.substring(line.indexOf(':') + 1).trim();
      
      const nameMatch = infoLine.match(/,(.*)/);
      const name = nameMatch ? nameMatch[1] : 'Unknown Channel';

      currentChannel = {
        id: Math.random().toString(36).substring(7), // Generate a random ID
        name: name.trim(),
      };

      const logoMatch = infoLine.match(/tvg-logo="([^"]*)"/);
      currentChannel.logo = logoMatch ? logoMatch[1] : 'https://i.imgur.com/8z5g5c7.png'; // Generic placeholder

      const groupMatch = infoLine.match(/group-title="([^"]*)"/);
      currentChannel.group = groupMatch ? groupMatch[1] : 'General';
      currentChannel.country = 'N/A'; // Country is not standard in M3U

    } else if (line.trim() && !line.startsWith('#')) {
      if (currentChannel.name) {
        currentChannel.url = line.trim();
        channels.push(currentChannel as Channel);
        currentChannel = {};
      }
    }
  }

  const uniqueGroups = [...new Set(channels.map((ch) => ch.group).filter(Boolean))];
  const categories: Category[] = [
    { name: 'All Channels', icon: 'all' },
    ...uniqueGroups.sort().map((groupName): Category => {
      let icon: IconName = 'tv';
      if (!groupName) return { name: 'General', icon: 'tv'};
      switch (groupName.toLowerCase()) {
        case 'movies': icon = 'movies'; break;
        case 'news': icon = 'news'; break;
        case 'sports': icon = 'sports'; break;
        case 'kids': icon = 'kids'; break;
        case 'documentary': icon = 'documentary'; break;
        case 'music': icon = 'music'; break;
        case 'entertainment': icon = 'entertainment'; break;
      }
      return { name: groupName, icon };
    }),
  ];

  return { channels, categories };
};


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaylistLoaded, setIsPlaylistLoaded] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All Channels');
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'name-asc' | 'name-desc'>('default');
  const [currentView, setCurrentView] = useState<'dashboard' | 'player'>('dashboard');

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const storedFavorites = localStorage.getItem('iptv_favorites');
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('iptv_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = useCallback((channelId: string) => {
    setFavorites(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  }, []);

  const handleFileLoad = useCallback((m3uContent: string) => {
    if (!m3uContent) return;
    try {
      const { channels: parsedChannels, categories: parsedCategories } = parseM3u(m3uContent);
      if (parsedChannels.length === 0) {
        throw new Error("No channels found in the playlist.");
      }
      setChannels(parsedChannels);

      const favoritesCategory: Category = { name: 'Favorites', icon: 'star' };
      setCategories([favoritesCategory, ...parsedCategories]);
      
      setIsPlaylistLoaded(true);
      setCurrentView('dashboard'); // Go to dashboard after load

      if (parsedChannels.length > 0) {
        setCurrentChannel(parsedChannels[0]);
      }
    } catch (error) {
        alert("Failed to parse the playlist file. It might be corrupted or in an unsupported format.");
        console.error("Error parsing M3U file:", error);
        setIsPlaylistLoaded(false);
    }
  }, []);

  useEffect(() => {
    const loadDefaultPlaylist = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://iptv-org.github.io/iptv/languages/ara.m3u');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const m3uContent = await response.text();
        handleFileLoad(m3uContent);
      } catch (error) {
        console.error("Failed to load default playlist:", error);
        alert(`Failed to load the default channel list. You can try loading your own file.\nError: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadDefaultPlaylist();
  }, [handleFileLoad]);


  const filteredChannels = useMemo(() => {
    let channelsToFilter = channels;

    if (selectedCategory === 'Favorites') {
      channelsToFilter = channels.filter(channel => favorites.includes(channel.id));
    } else if (selectedCategory !== 'All Channels') {
      channelsToFilter = channelsToFilter.filter(
        (channel) => channel.group === selectedCategory
      );
    }

    if (searchTerm) {
      channelsToFilter = channelsToFilter.filter((channel) =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sortOrder === 'name-asc') {
        return [...channelsToFilter].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortOrder === 'name-desc') {
        return [...channelsToFilter].sort((a, b) => b.name.localeCompare(a.name));
    }

    return channelsToFilter; // 'default' order
  }, [channels, selectedCategory, searchTerm, sortOrder, favorites]);

  const handleSelectChannel = (channel: Channel) => {
    setCurrentChannel(channel);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#121212] text-white">
        <div className="text-center p-8">
            <svg className="animate-spin h-12 w-12 text-[#8A1538] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h1 className="text-2xl font-bold">Loading Channels...</h1>
            <p className="text-gray-400">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!isPlaylistLoaded) {
    return <LoginScreen onFileLoad={handleFileLoad} />;
  }
  
  if (currentView === 'dashboard') {
    return <Dashboard onNavigate={(view) => setCurrentView(view)} />;
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Categories Panel */}
        <aside className="w-20 md:w-64 bg-[#1E1E1E] flex-shrink-0 overflow-y-auto">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onBack={() => setCurrentView('dashboard')}
          />
        </aside>

        {/* Channels Panel */}
        <nav className="w-72 lg:w-96 bg-[#121212] flex flex-col flex-shrink-0">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <div className="flex-1 overflow-y-auto">
            <ChannelList
              channels={filteredChannels}
              currentChannel={currentChannel}
              onSelectChannel={handleSelectChannel}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </nav>

        {/* Player Area */}
        <main className="flex-1 bg-black flex flex-col">
          <Player 
            channel={currentChannel}
            channels={filteredChannels}
            onSelectChannel={handleSelectChannel}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </main>
      </div>
    </div>
  );
}