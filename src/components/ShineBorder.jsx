import { cn } from '@/lib/utils';

export default function ShineBorder({
  borderRadius = 12,
  borderWidth = 1,
  duration = 14,
  color = ['#3B82F6', '#A855F7', '#38bdf8'],
  className,
  children,
}) {
  const colorStr = Array.isArray(color) ? color.join(',') : color;

  return (
    <div
      style={{
        '--border-radius': `${borderRadius}px`,
        '--border-width': `${borderWidth}px`,
        '--shine-pulse-duration': `${duration}s`,
        '--mask-linear-gradient': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        '--background-radial-gradient': `radial-gradient(transparent,transparent,${colorStr},transparent,transparent)`,
      }}
      className={cn(
        'relative w-full overflow-hidden rounded-xl',
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-xl p-[--border-width] will-change-[background-position] content-[''] ![-webkit-mask-composite:xor] [background-image:--background-radial-gradient] [background-size:300%_300%] ![mask-composite:exclude] [mask:--mask-linear-gradient] motion-safe:animate-shine-pulse"
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}