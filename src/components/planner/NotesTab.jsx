import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function NotesTab({ projectId, notes, setNotes }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSaving(true);
    const note = await base44.entities.ProjectNote.create({
      projectId,
      noteText: text.trim(),
    });
    setNotes(prev => [note, ...prev]);
    setText('');
    setAdding(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.ProjectNote.delete(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Button size="sm" onClick={() => setAdding(true)} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Note
        </Button>
      </div>

      {adding && (
        <div className="p-4 rounded-lg border border-white/[0.08] bg-white/[0.02] mb-4 space-y-3">
          <Textarea
            placeholder="Write a note..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="bg-card border-border/30 min-h-[80px]"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setText(''); }}>Cancel</Button>
            <Button size="sm" disabled={!text.trim() || saving} onClick={handleAdd} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              Save
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 && !adding ? (
        <p className="text-center py-12 text-[#71717A] text-sm">No notes yet.</p>
      ) : (
        <div className="space-y-2">
          {notes.map(note => (
            <BorderGlow key={note.id}>
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#D4D4D8] whitespace-pre-wrap">{note.noteText}</p>
                  <p className="text-[10px] text-[#71717A] mt-2">
                    {new Date(note.created_date).toLocaleString()}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(note.id)} className="h-7 w-7 text-[#71717A] hover:text-red-400">
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