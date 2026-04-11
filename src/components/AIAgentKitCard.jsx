import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BorderGlow from './BorderGlow';

export default function AIAgentKitCard({ kit }) {
  return (
    <BorderGlow>
      <div className="p-5">
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
    </BorderGlow>
  );
}