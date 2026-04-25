import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Image, Copy, Check, Save } from 'lucide-react';

export default function PostGenerator({ onPostSaved }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [link, setLink] = useState('https://kodeos.app');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setGenerated(null);
    const res = await base44.functions.invoke('generateMarketingPost', { topic, platform, link });
    setGenerated(res.data);
    setGenerating(false);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSaveAsDraft = async () => {
    if (!generated) return;
    setSaving(true);
    await base44.entities.MarketingPost.create({
      topic,
      platform,
      content: generated.content,
      hashtags: generated.hashtags,
      imageUrl: generated.imageUrl,
      link,
      status: 'draft',
    });
    setSaving(false);
    setGenerated(null);
    setTopic('');
    onPostSaved?.();
  };

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Topic / Idea</label>
          <Input
            placeholder="e.g. Why vibecoders need curated AI toolkits..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-background border-border"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Platform</label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="twitter">Twitter / X</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-text-secondary mb-1.5 block">Promo Link</label>
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="bg-background border-border"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={generating || !topic.trim()}
        className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
      >
        {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
        {generating ? 'Generating...' : 'Generate Post'}
      </Button>

      {generated && (
        <div className="space-y-4 p-5 rounded-xl border border-surface-border bg-card">
          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Post Content</label>
              <Button size="sm" variant="ghost" onClick={() => handleCopy(generated.content, 'content')} className="h-7 text-xs">
                {copied === 'content' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied === 'content' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="text-sm text-foreground whitespace-pre-wrap bg-background rounded-lg p-3 border border-border">
              {generated.content}
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Hashtags</label>
              <Button size="sm" variant="ghost" onClick={() => handleCopy(generated.hashtags, 'hashtags')} className="h-7 text-xs">
                {copied === 'hashtags' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied === 'hashtags' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-[#3B82F6]">{generated.hashtags}</p>
          </div>

          {/* Image */}
          {generated.imageUrl && (
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
                <Image className="w-3.5 h-3.5 inline mr-1" /> Generated Image
              </label>
              <img src={generated.imageUrl} alt="Generated" className="rounded-lg max-h-64 object-cover w-full" />
            </div>
          )}

          {/* Save */}
          <Button onClick={handleSaveAsDraft} disabled={saving} className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save as Draft
          </Button>
        </div>
      )}
    </div>
  );
}