import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, X, Check, Loader2, Sparkles } from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function PlannerItemList({
  projectId,
  project,
  entityName,
  items,
  setItems,
  label,
  nameField,
  descField,
  renderExtra,
  icon: Icon,
  color,
  allItems,
}) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const item = await base44.entities[entityName].create({
      projectId,
      [nameField]: newName.trim(),
      ...(descField ? { [descField]: newDesc.trim() } : {}),
    });
    setItems(prev => [...prev, item]);
    setNewName('');
    setNewDesc('');
    setAdding(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await base44.entities[entityName].delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAISuggest = async () => {
    setAiLoading(true);
    const existingNames = items.map(i => i[nameField]).join(', ');
    const context = allItems || {};

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert app architect. A user is building "${project.name}" - ${project.description}.
App type: ${project.appType || 'web app'}. Target: ${project.targetPlatform || 'Base44'}.

They currently have these ${label.toLowerCase()}: ${existingNames || 'none yet'}

${context.pages ? `Existing pages: ${context.pages.map(p => p.pageName).join(', ')}` : ''}
${context.features ? `Existing features: ${context.features.map(f => f.featureName).join(', ')}` : ''}
${context.roles ? `Existing roles: ${context.roles.map(r => r.roleName).join(', ')}` : ''}
${context.data ? `Existing data entities: ${context.data.map(d => d.entityName).join(', ')}` : ''}

Suggest 5-8 new ${label.toLowerCase()} they likely need but don't have yet. Return a JSON array of objects with "${nameField}" and "${descField || 'description'}" fields. Only include genuinely useful suggestions, no duplicates of what exists.`,
      response_json_schema: {
        type: 'object',
        properties: {
          suggestions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                [nameField]: { type: 'string' },
                [descField || 'description']: { type: 'string' },
              },
            },
          },
        },
      },
    });

    if (result?.suggestions) {
      const created = [];
      for (const s of result.suggestions) {
        const item = await base44.entities[entityName].create({
          projectId,
          [nameField]: s[nameField],
          ...(descField ? { [descField]: s[descField] || s.description || '' } : {}),
        });
        created.push(item);
      }
      setItems(prev => [...prev, ...created]);
    }
    setAiLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" style={{ color }} />}
          {label}
          <span className="text-sm font-normal text-[#71717A]">({items.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAISuggest}
            disabled={aiLoading}
            className="gap-1.5 text-xs"
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            AI Suggest
          </Button>
          <Button
            size="sm"
            onClick={() => setAdding(true)}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
      </div>

      {adding && (
        <div className="p-4 rounded-lg border border-white/[0.08] bg-white/[0.02] mb-4 space-y-3">
          <Input
            placeholder={`${label.slice(0, -1)} name`}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="bg-card border-border/30"
            autoFocus
          />
          {descField && (
            <Textarea
              placeholder="Description (optional)"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="bg-card border-border/30 min-h-[60px]"
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewName(''); setNewDesc(''); }}>
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
            <Button size="sm" disabled={!newName.trim() || saving} onClick={handleAdd} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
              Save
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 && !adding ? (
        <div className="text-center py-12 text-[#71717A] text-sm">
          No {label.toLowerCase()} yet. Add one or use AI Suggest.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <BorderGlow key={item.id}>
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white">{item[nameField]}</h4>
                  {descField && item[descField] && (
                    <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-2">{item[descField]}</p>
                  )}
                  {renderExtra && renderExtra(item)}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(item.id)}
                  className="h-7 w-7 text-[#71717A] hover:text-red-400 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </BorderGlow>
          ))}
        </div>
      )}
    </div>
  );
}