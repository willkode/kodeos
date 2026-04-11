import { ExternalLink } from 'lucide-react';
import BorderGlow from './BorderGlow';
import FlipButton from './FlipButton';

export default function AIAgentKitCard({ kit }) {
  return (
    <BorderGlow>
      <div className="p-5">
        <h3 className="text-base font-semibold mb-2 line-clamp-2">{kit.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {kit.description}
        </p>
        <a href={kit.url} target="_blank" rel="noopener noreferrer">
          <FlipButton text="View API" textAlt="View API" />
        </a>
      </div>
    </BorderGlow>
  );
}