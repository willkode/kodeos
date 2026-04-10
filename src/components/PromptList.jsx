import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export default function PromptList({ prompts, onEdit, onDelete }) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No prompts yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {prompts.map(prompt => (
        <div
          key={prompt.id}
          className="p-4 rounded-lg border border-border/30 bg-card/50 flex items-start justify-between hover:border-primary/30 transition-all"
        >
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{prompt.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{prompt.description}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 rounded bg-primary/10 text-primary">
                {prompt.category}
              </span>
              <span className={`px-2 py-1 rounded ${
                prompt.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                prompt.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {prompt.difficulty}
              </span>
              <span className="text-muted-foreground">
                {prompt.platforms.length} platforms
              </span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(prompt)}
              className="border-border/50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(prompt.id)}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}