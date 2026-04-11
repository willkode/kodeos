import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIAgentKitCard({ kit }) {
  return (
    <div className="p-5 rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
      <h3 className="text-base font-semibold mb-2 line-clamp-2">{kit.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {kit.description}
      </p>
      <a href={kit.url} target="_blank" rel="noopener noreferrer">
        <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <ExternalLink className="w-4 h-4 mr-2" />
          View API
        </Button>
      </a>
    </div>
  );
}