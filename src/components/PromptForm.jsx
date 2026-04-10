import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const categories = [
  'Landing Pages',
  'Auth Flows',
  'Dashboards',
  'E-commerce',
  'Admin Panels',
  'Forms',
  'Real-time',
  'AI Integration',
  'Animations',
  'State Management'
];

const platforms = [
  'Base44',
  'Lovable',
  'Bolt',
  'Replit',
  'Floot',
  'Emergent.sh',
  'V0 by Vercel',
  'Vitara AI',
  'Rocket.new',
  'Meku'
];

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function PromptForm({ initialPrompt, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialPrompt || {
      title: '',
      description: '',
      category: '',
      content: '',
      platforms: [],
      difficulty: '',
      tags: []
    }
  );

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.content || formData.platforms.length === 0 || !formData.difficulty) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-2">Title *</label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Build a Modern Landing Page"
          className="bg-background border-border/30"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">Description *</label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What does this prompt do?"
          className="bg-background border-border/30 h-20"
        />
      </div>

      {/* Category & Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Category *</label>
          <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
            <SelectTrigger className="bg-background border-border/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/30">
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Difficulty *</label>
          <Select value={formData.difficulty} onValueChange={(v) => handleChange('difficulty', v)}>
            <SelectTrigger className="bg-background border-border/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/30">
              {difficulties.map(diff => (
                <SelectItem key={diff} value={diff}>{diff}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Platforms */}
      <div>
        <label className="block text-sm font-semibold mb-2">Compatible Platforms *</label>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map(platform => (
            <label key={platform} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-background/50 transition">
              <input
                type="checkbox"
                checked={formData.platforms.includes(platform)}
                onChange={() => handlePlatformToggle(platform)}
                className="w-4 h-4 rounded border-border/50 bg-background"
              />
              <span className="text-sm">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold mb-2">Prompt Content *</label>
        <Textarea
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Paste the full prompt here..."
          className="bg-background border-border/30 h-40 font-mono text-xs"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
        <Input
          value={formData.tags.join(', ')}
          onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
          placeholder="react, tailwind, responsive"
          className="bg-background border-border/30"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4 border-t border-border/30">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
        >
          {initialPrompt ? 'Update Prompt' : 'Create Prompt'}
        </Button>
      </div>
    </form>
  );
}