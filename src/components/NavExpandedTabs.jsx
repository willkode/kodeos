import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, User, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: {
    width: 'auto',
    opacity: 1,
    transition: { delay: 0.05, duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};

const BASE_TABS = [
  { title: 'Dashboard', icon: Home, path: '/dashboard' },
  { title: 'Profile', icon: User, path: '/profile' },
  { type: 'separator' },
  { title: 'Settings', icon: Settings, path: '/settings' },
  { title: 'Logout', icon: LogOut, action: 'logout' },
];

const ADMIN_TAB = { title: 'Admin', icon: Shield, path: '/admin' };

export default function NavExpandedTabs({ user }) {
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const TABS = user?.role === 'admin'
    ? [...BASE_TABS.slice(0, 3), ADMIN_TAB, ...BASE_TABS.slice(3)]
    : BASE_TABS;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSelected(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (index, tab) => {
    setSelected(index);
    if (tab.action === 'logout') {
      base44.auth.logout();
    } else if (tab.path) {
      navigate(tab.path);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1 rounded-full border border-surface-border bg-surface-hover p-1 shadow-md backdrop-blur-sm"
    >
      {TABS.map((tab, index) => {
        if (tab.type === 'separator') {
          return (
            <div
              key={`sep-${index}`}
              className="h-7 w-px bg-border"
              aria-hidden="true"
            />
          );
        }
        const Icon = tab.icon;
        const isSelected = selected === index;
        return (
          <button
            key={tab.title}
            onClick={() => handleSelect(index, tab)}
            className={`relative z-10 flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors focus:outline-none ${
              isSelected
                ? 'text-[#3B82F6]'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 z-0 rounded-full bg-[#3B82F6]/15 backdrop-blur-sm border border-[#3B82F6]/30 shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="h-4 w-4 flex-shrink-0" />
              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="overflow-hidden whitespace-nowrap text-sm"
                  >
                    {tab.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </button>
        );
      })}
    </div>
  );
}