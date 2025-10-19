import React, { useRef } from 'react';
import Icon from './Icon';

interface LoginScreenProps {
  onFileLoad: (fileContent: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onFileLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onFileLoad(content);
        } else {
          alert("Could not read the file.");
        }
      };
      reader.onerror = () => {
        alert("Error reading file.");
      }
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#121212] text-white">
      <div className="text-center p-8 sm:p-12 bg-[#1E1E1E] rounded-2xl shadow-2xl max-w-md w-full border border-gray-800/50">
        <h1 className="text-5xl font-bold tracking-wide mb-4">
          AHMAD ODAT <span className="font-light text-gray-300">IPTV</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10">Load your M3U playlist to begin streaming.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".m3u,.m3u8"
          className="hidden"
          aria-hidden="true"
        />
        <button
          onClick={handleButtonClick}
          className="w-full bg-[#8A1538] hover:bg-[#A9264F] text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50"
          aria-label="Load M3U playlist from your device"
        >
          Load Playlist File
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;