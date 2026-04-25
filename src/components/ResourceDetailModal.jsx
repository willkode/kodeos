import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ResourceDetailModal({ item, type, open, onClose }) {
  const [appDescription, setAppDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const typeLabel = type === 'api' ? 'AI Model API' : type === 'agent' ? 'Agent Kit' : 'MCP Server';

  const handleGeneratePrompt = async () => {
    if (!appDescription.trim()) return;
    setGenerating(true);
    setGeneratedPrompt('');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert AI developer assistant. A user wants to integrate "${item.name}" into their app.

Resource: ${item.name}
Type: ${typeLabel}
Description: ${item.description}
${item.detailed_info ? `Detailed Info: ${item.detailed_info}` : ''}
URL: ${item.url}

User's app description: ${appDescription}

Generate a clear, actionable integration prompt that the user can paste into an AI coding assistant (like Base44, Cursor, Lovable, etc.) to integrate this resource into their app. The prompt should:
1. Explain what the resource does
2. Give specific integration steps for their app
3. Include any relevant API patterns or configuration
4. Be ready to copy-paste

Format the response in markdown.`,
    });
    setGeneratedPrompt(result);
    setGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background border-surface-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] font-medium">{typeLabel}</span>
            {item.category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-text-secondary">{item.category}</span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
        </DialogHeader>

        {/* Description */}
        <div className="space-y-4 mt-2">
          <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>

          {/* Detailed Info */}
          {item.detailed_info && (
            <div className="p-5 rounded-xl border border-surface-border bg-surface-hover space-y-0">
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Details</h4>
              <div className="text-sm text-foreground/85 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h2 className="text-base font-bold text-foreground mt-5 mb-2 first:mt-0">{children}</h2>,
                    h2: ({ children }) => <h3 className="text-sm font-bold text-foreground mt-5 mb-2 first:mt-0">{children}</h3>,
                    h3: ({ children }) => <h4 className="text-sm font-semibold text-foreground mt-4 mb-1.5">{children}</h4>,
                    p: ({ children }) => <p className="my-2 leading-relaxed text-foreground/85">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                    ul: ({ children }) => <ul className="my-2 ml-4 space-y-1 list-disc marker:text-[#3B82F6]/60">{children}</ul>,
                    ol: ({ children }) => <ol className="my-2 ml-4 space-y-1 list-decimal marker:text-[#3B82F6]/60">{children}</ol>,
                    li: ({ children }) => <li className="text-foreground/85 pl-1">{children}</li>,
                    hr: () => <hr className="border-surface-border my-4" />,
                    code: ({ inline, children }) => inline 
                      ? <code className="px-1.5 py-0.5 rounded bg-surface-hover text-[#60A5FA] text-xs font-mono">{children}</code>
                      : <pre className="my-3 p-3 rounded-lg bg-background border border-surface-border overflow-x-auto"><code className="text-xs font-mono text-foreground/85">{children}</code></pre>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:text-[#60A5FA] underline underline-offset-2">{children}</a>,
                    blockquote: ({ children }) => <blockquote className="border-l-2 border-[#3B82F6]/30 pl-3 my-3 text-text-secondary italic">{children}</blockquote>,
                  }}
                >{item.detailed_info}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Prompt Generator */}
          <div className="p-4 rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/[0.03]">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              Integration Prompt Generator
            </h4>
            <p className="text-xs text-text-secondary mb-3">Describe your app and we'll generate a prompt to help you integrate this resource.</p>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="e.g. A task management SaaS built with React..."
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                className="bg-background border-surface-border text-sm"
              />
              <Button
                onClick={handleGeneratePrompt}
                disabled={generating || !appDescription.trim()}
                className="bg-[#3B82F6] text-white hover:bg-[#2563EB] shrink-0"
                size="sm"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
              </Button>
            </div>

            {generatedPrompt && (
              <div className="relative">
                <div className="p-3 rounded-lg bg-background border border-surface-border text-sm text-foreground max-h-60 overflow-y-auto prose prose-sm max-w-none">
                  <ReactMarkdown>{generatedPrompt}</ReactMarkdown>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 h-7 px-2 text-xs"
                >
                  {copied ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
                </Button>
              </div>
            )}
          </div>

          {/* External Link */}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-surface-border text-sm text-text-secondary hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View on External Site
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}