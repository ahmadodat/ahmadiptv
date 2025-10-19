import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000); // Update every second
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
    
    const minutesStr = minutes < 10 ? '0' + minutes : String(minutes);

    return `${hours12}:${minutesStr} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <header className="flex items-center justify-between h-16 bg-[#1E1E1E] px-6 flex-shrink-0 z-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-wider text-white">
          AHMAD ODAT <span className="font-light text-gray-300">IPTV</span>
        </h1>
      </div>
      <div className="flex items-baseline gap-4 text-right">
        <span className="text-xl font-mono text-gray-300 hidden sm:block whitespace-nowrap">
          {formatTime(time)}
        </span>
        <span className="text-base font-medium text-gray-400 hidden md:block whitespace-nowrap">
          {formatDate(time)}
        </span>
      </div>
    </header>
  );
};

export default Header;