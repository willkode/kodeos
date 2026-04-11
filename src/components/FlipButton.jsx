import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FlipButton({ text, textAlt, onClick, className = '' }) {
  const [flipped, setFlipped] = useState(false);

  const flipVariants = {
    one: {
      rotateX: 0,
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
    two: {
      rotateX: 180,
      backgroundColor: '#f4f4f5',
      color: '#18181b',
    },
  };

  const handleClick = () => {
    setFlipped(!flipped);
    if (onClick) onClick();
  };

  return (
    <motion.button
      className={`w-full cursor-pointer px-6 py-2.5 font-medium text-sm rounded-full ${className}`}
      onClick={handleClick}
      animate={flipped ? 'two' : 'one'}
      variants={flipVariants}
      transition={{ duration: 0.6, type: 'spring' }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="flex items-center justify-center gap-2"
      >
        {flipped ? (textAlt || text) : text}
      </motion.div>
    </motion.button>
  );
}