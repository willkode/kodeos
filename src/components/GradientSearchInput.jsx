import { useRef, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';

export default function GradientSearchInput({ value, onChange, placeholder = "Search..." }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative p-px rounded-2xl bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/20 transition-shadow duration-300 hover:shadow-purple-500/40 focus-within:shadow-purple-500/40">
      <div className="flex items-center w-full px-4 py-2 bg-[#09090B]/90 rounded-[15px]">
        <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-1 text-base text-gray-200 placeholder-gray-500 bg-transparent focus:outline-none flex-1 min-w-0"
        />
      </div>
    </div>
  );
}