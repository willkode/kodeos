import { useRef, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const CommandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);

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
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center p-1.5 bg-gray-800 border border-gray-700 rounded-md shadow-inner">
            <CommandIcon />
          </div>
          <div className="flex items-center justify-center w-6 h-6 p-1 bg-gray-800 border border-gray-700 rounded-md shadow-inner">
            <span className="text-sm font-semibold text-gray-300">K</span>
          </div>
        </div>
      </div>
    </div>
  );
}