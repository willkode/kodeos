import { useRef, useEffect, useCallback, useMemo } from 'react';

export default function GlitchLogo({ text = 'KODEOS', fontSize = 10 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameId = useRef(null);
  const grid = useRef({ columns: 0, rows: 0, charWidth: 0, charHeight: 0 });
  const letters = useRef([]);
  const lastGlitchTime = useRef(0);

  const glitchColors = useMemo(() => ['#ff7cce', '#7cf0ff', '#fcf07c', '#8E44AD', '#3498DB'], []);
  const characterSet = useMemo(() => '.:*+=#%@",', []);
  const getRandomChar = useCallback(() => characterSet[Math.floor(Math.random() * characterSet.length)], [characterSet]);
  const getRandomColor = useCallback(() => glitchColors[Math.floor(Math.random() * glitchColors.length)], [glitchColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let canvasWidth = 0;
    let canvasHeight = 0;

    const setup = () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.font = `${fontSize}px monospace`;
      const charMetrics = ctx.measureText('M');
      grid.current = {
        columns: Math.floor(canvasWidth / charMetrics.width),
        rows: Math.floor(canvasHeight / (fontSize * 1.2)),
        charWidth: charMetrics.width,
        charHeight: fontSize * 1.2,
      };
      const extendedRows = grid.current.rows * 2;
      const totalLetters = grid.current.columns * extendedRows;
      letters.current = Array.from({ length: totalLetters }, (_, i) => {
        const col = i % grid.current.columns;
        const row = Math.floor(i / grid.current.columns);
        return {
          char: getRandomChar(),
          x: col * grid.current.charWidth,
          y: row * grid.current.charHeight - grid.current.rows * grid.current.charHeight,
          color: getRandomColor(),
        };
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const animate = (timestamp) => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (timestamp - lastGlitchTime.current > 50) {
        lastGlitchTime.current = timestamp;
        const updateCount = Math.floor(letters.current.length * 0.05);
        for (let i = 0; i < updateCount; i++) {
          const index = Math.floor(Math.random() * letters.current.length);
          if (letters.current[index]) {
            letters.current[index].char = getRandomChar();
            letters.current[index].color = getRandomColor();
          }
        }
      }
      const totalFieldHeight = grid.current.rows * grid.current.charHeight * 2;
      letters.current.forEach((letter) => {
        letter.y += 0.75;
        if (letter.y > canvasHeight) letter.y -= totalFieldHeight;
      });
      ctx.fillStyle = '#080A12';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';
      letters.current.forEach((letter) => {
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, letter.x, letter.y);
      });
    };

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setup, 150);
    };
    window.addEventListener('resize', handleResize);
    setup();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [fontSize, getRandomChar, getRandomColor]);

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ width: 'fit-content', height: '64px' }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,_transparent_60%,_black_100%)]" />
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <span className="text-xl font-bold tracking-widest text-white mix-blend-screen">{text}</span>
      </div>
    </div>
  );
}