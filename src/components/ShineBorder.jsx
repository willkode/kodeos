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
      style={{ '--border-radius': `${borderRadius}px` }}
      className={cn(
        'relative grid w-full place-items-center rounded-xl bg-transparent',
        className
      )}
    >
      <div
        style={{
          '--border-width': `${borderWidth}px`,
          '--border-radius': `${borderRadius}px`,
          '--shine-pulse-duration': `${duration}s`,
          '--mask-linear-gradient': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          '--background-radial-gradient': `radial-gradient(transparent,transparent,${colorStr},transparent,transparent)`,
        }}
        className="before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-xl before:p-[--border-width] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:![mask-composite:exclude] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine-pulse"
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}