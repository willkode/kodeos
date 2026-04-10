import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function PromptCard({ prompt }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
      {/* Category & Difficulty */}
      <div className="flex items-center justify-between mb-4">
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
          {prompt.category}
        </div>
        <div className={`text-xs font-semibold px-2 py-1 rounded ${
          prompt.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
          prompt.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {prompt.difficulty}
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
      <Button
        size="sm"
        onClick={handleCopy}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
      >
        <Copy className="w-4 h-4 mr-2" />
        {copied ? 'Copied!' : 'Copy Prompt'}
      </Button>
    </div>
  );
}