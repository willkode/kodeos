import { ExternalLink } from 'lucide-react';
import BorderGlow from './BorderGlow';
import FlipButton from './FlipButton';

export default function MCPServerCard({ server }) {
  return (
    <BorderGlow>
      <div className="p-5">
        <h3 className="text-base font-semibold mb-2 line-clamp-2">{server.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {server.description}
        </p>
        <a href={server.url} target="_blank" rel="noopener noreferrer">
          <FlipButton text="View Server" textAlt="View Server" />
        </a>
      </div>
    </BorderGlow>
  );
}