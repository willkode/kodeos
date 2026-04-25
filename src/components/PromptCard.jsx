import { Copy, Bookmark } from 'lucide-react';
import { useState } from 'react';
import BorderGlow from './BorderGlow';
import FlipButton from './FlipButton';

export default function PromptCard({ prompt, isSaved, onToggleSave }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BorderGlow>
      <div className="p-6 relative">
        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#3B82F6] text-[#3B82F6]' : 'text-text-tertiary'}`} />
        </button>

        {/* Category */}
        <div className="mb-4 pr-8">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
            {prompt.category}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">{prompt.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {prompt.description}
        </p>

        {/* Platforms */}
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.platforms.slice(0, 3).map(platform => (
            <span
              key={platform}
              className="text-xs px-2 py-1 rounded border border-border/50 text-muted-foreground"
            >
              {platform}
            </span>
          ))}
          {prompt.platforms.length > 3 && (
            <span className="text-xs px-2 py-1 text-muted-foreground">
              +{prompt.platforms.length - 3} more
            </span>
          )}
        </div>

        {/* Preview */}
        <div className="mb-4 p-3 rounded bg-background/50 border border-border/50 font-mono text-xs text-muted-foreground line-clamp-3">
          {prompt.content.substring(0, 120)}...
        </div>

        {/* Actions */}
        <FlipButton
          text="Copy Prompt"
          textAlt="Copied!"
          onClick={handleCopy}
        />
      </div>
    </BorderGlow>
  );
}