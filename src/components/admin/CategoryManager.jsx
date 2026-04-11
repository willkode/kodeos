import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { PROMPT_CATEGORIES } from '../../lib/promptCategories';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CategoryManager({ prompts, onPromptsCreated }) {
  const [generating, setGenerating] = useState({});
  const [counts, setCounts] = useState({});
  const [results, setResults] = useState({});
  const stopRef = useRef({});

  const categoryCounts = PROMPT_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = prompts.filter(p => p.category === cat).length;
    return acc;
  }, {});

  // Also find categories in data not in the predefined list
  const extraCategories = [...new Set(prompts.map(p => p.category))].filter(
    cat => !PROMPT_CATEGORIES.includes(cat)
  );
  const allCategories = [...PROMPT_CATEGORIES, ...extraCategories];
  for (const cat of extraCategories) {
    categoryCounts[cat] = prompts.filter(p => p.category === cat).length;
  }

  const handleGenerate = async (category) => {
    const count = parseInt(counts[category]) || 0;
    if (count <= 0 || count > 50) return;

    setGenerating(prev => ({ ...prev, [category]: true }));
    setResults(prev => ({ ...prev, [category]: { done: 0, total: count, errors: 0 } }));
    stopRef.current[category] = false;

    for (let i = 0; i < count; i++) {
      if (stopRef.current[category]) break;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a prompt engineer creating prompts for no-code AI development platforms (Base44, Lovable, Bolt, Replit, V0 by Vercel, etc.).

Generate a unique, production-ready prompt for the category: "${category}"

The prompt should be detailed and actionable — something a developer can paste into a no-code platform to build a real feature.

Rules:
- The "content" field should be a thorough, multi-paragraph prompt (at least 200 words) that tells an AI exactly what to build
- The category MUST be exactly: "${category}"
- Pick difficulty from: Beginner, Intermediate, Advanced
- Pick 2-5 most relevant platforms from: Base44, Lovable, Bolt, Replit, Floot, Emergent.sh, V0 by Vercel, Vitara AI, Rocket.new, Meku
- Generate 2-5 relevant tags
- Make it unique and different from common prompts`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            content: { type: "string" },
            platforms: { type: "array", items: { type: "string" } },
            difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      try {
        await base44.entities.Prompt.create({ ...aiResponse, category });
        setResults(prev => ({
          ...prev,
          [category]: { ...prev[category], done: prev[category].done + 1 }
        }));
      } catch {
        setResults(prev => ({
          ...prev,
          [category]: { ...prev[category], errors: prev[category].errors + 1 }
        }));
      }
    }

    setGenerating(prev => ({ ...prev, [category]: false }));
    if (onPromptsCreated) onPromptsCreated();
  };

  const handleStop = (category) => {
    stopRef.current[category] = true;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">{allCategories.length} categories</p>
      </div>

      <div className="space-y-1">
        {allCategories.map(cat => {
          const count = categoryCounts[cat] || 0;
          const isGenerating = generating[cat];
          const result = results[cat];
          const isExtra = extraCategories.includes(cat);

          return (
            <div
              key={cat}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border/30 bg-card/50 hover:border-border/50 transition-all"
            >
              {/* Category name & count */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{cat}</span>
                  {isExtra && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">custom</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{count} prompt{count !== 1 ? 's' : ''}</span>
              </div>

              {/* Generation status */}
              {result && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {isGenerating ? (
                    <Loader2 className="w-3 h-3 animate-spin text-[#3B82F6]" />
                  ) : result.done === result.total ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                  )}
                  <span>{result.done}/{result.total}</span>
                </div>
              )}

              {/* Input + Generate button */}
              {isGenerating ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStop(cat)}
                  className="text-xs h-8"
                >
                  Stop
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="#"
                    value={counts[cat] || ''}
                    onChange={(e) => setCounts(prev => ({ ...prev, [cat]: e.target.value }))}
                    className="w-16 h-8 text-xs bg-background border-border/30 text-center"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleGenerate(cat)}
                    disabled={!counts[cat] || parseInt(counts[cat]) <= 0}
                    className="bg-[#3B82F6] text-white hover:bg-[#2563EB] h-8 text-xs gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    Generate
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}