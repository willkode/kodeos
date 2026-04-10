import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Play } from 'lucide-react';

export default function AIPromptGenerator({ onPromptsCreated }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const stopRef = useRef(false);

  const parseEntries = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const entries = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip section headers like "3. Base44 / Lovable..."
      if (/^\d+\.\s/.test(line)) continue;
      // Check if next line is a description (not a title-like line)
      const nextLine = lines[i + 1];
      if (nextLine && !/^\d+\.\s/.test(nextLine) && !nextLine.endsWith('Prompt') && !nextLine.endsWith('prompt')) {
        entries.push({ title: line, description: nextLine });
        i++; // skip description line
      } else {
        entries.push({ title: line, description: '' });
      }
    }
    return entries;
  };

  const generateAndSave = async () => {
    const entries = parseEntries(input);
    if (entries.length === 0) return;

    setIsRunning(true);
    stopRef.current = false;

    const initialResults = entries.map(entry => ({
      title: entry.title,
      status: 'pending',
      error: null,
    }));
    setResults(initialResults);

    for (let i = 0; i < entries.length; i++) {
      if (stopRef.current) break;

      setResults(prev => prev.map((r, idx) =>
        idx === i ? { ...r, status: 'generating' } : r
      ));

      const entry = entries[i];
      const promptIdea = entry.description ? `${entry.title} — ${entry.description}` : entry.title;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a prompt engineer creating prompts for no-code AI development platforms (Base44, Lovable, Bolt, Replit, V0 by Vercel, etc.).

Given this prompt idea: "${promptIdea}"

Generate a complete, production-ready prompt object. The prompt should be detailed and actionable — something a developer can paste into a no-code platform to build a real feature.

Rules:
- The "content" field should be a thorough, multi-paragraph prompt (at least 200 words) that tells an AI exactly what to build
- Pick the most relevant category from: Landing Pages, Auth Flows, Dashboards, E-commerce, Admin Panels, Forms, Real-time, AI Integration, Animations, State Management
- Pick difficulty from: Beginner, Intermediate, Advanced
- Pick 2-5 most relevant platforms from: Base44, Lovable, Bolt, Replit, Floot, Emergent.sh, V0 by Vercel, Vitara AI, Rocket.new, Meku
- Generate 2-5 relevant tags`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: {
              type: "string",
              enum: ["Landing Pages", "Auth Flows", "Dashboards", "E-commerce", "Admin Panels", "Forms", "Real-time", "AI Integration", "Animations", "State Management"]
            },
            content: { type: "string" },
            platforms: {
              type: "array",
              items: {
                type: "string",
                enum: ["Base44", "Lovable", "Bolt", "Replit", "Floot", "Emergent.sh", "V0 by Vercel", "Vitara AI", "Rocket.new", "Meku"]
              }
            },
            difficulty: {
              type: "string",
              enum: ["Beginner", "Intermediate", "Advanced"]
            },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      try {
        await base44.entities.Prompt.create(aiResponse);
        setResults(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: 'done' } : r
        ));
      } catch (err) {
        setResults(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: 'error', error: err.message } : r
        ));
      }
    }

    setIsRunning(false);
    if (onPromptsCreated) onPromptsCreated();
  };

  const handleStop = () => {
    stopRef.current = true;
  };

  const entries = parseEntries(input);
  const doneCount = results.filter(r => r.status === 'done').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">AI Prompt Generator</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Paste a list of prompt ideas (one per line). The AI will generate full prompt content for each and save them to the library.
        </p>
      </div>

      <div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Master App Build Prompt\nGives the platform a complete build direction.\nPhased Build Prompt Series\nBreaks the app into build phases."}
          className="bg-background border-border/30 h-48 font-mono text-sm"
          disabled={isRunning}
        />
        <p className="text-xs text-muted-foreground mt-2">
          {entries.length} prompt{entries.length !== 1 ? 's' : ''} detected (supports Title + Description pairs)
        </p>
      </div>

      <div className="flex items-center gap-3">
        {!isRunning ? (
          <Button
            onClick={generateAndSave}
            disabled={entries.length === 0}
            className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate {entries.length} Prompt{entries.length !== 1 ? 's' : ''}
          </Button>
        ) : (
          <Button onClick={handleStop} variant="destructive">
            Stop
          </Button>
        )}

        {results.length > 0 && !isRunning && (
          <p className="text-sm text-muted-foreground">
            {doneCount} created{errorCount > 0 ? `, ${errorCount} failed` : ''}
          </p>
        )}
      </div>

      {/* Progress list */}
      {results.length > 0 && (
        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border/30 bg-card/50 text-sm"
            >
              {r.status === 'pending' && (
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
              )}
              {r.status === 'generating' && (
                <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin flex-shrink-0" />
              )}
              {r.status === 'done' && (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
              {r.status === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
              <span className={r.status === 'done' ? 'text-muted-foreground' : ''}>
                {r.title}
              </span>
              {r.error && (
                <span className="text-xs text-red-400 ml-auto">{r.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}