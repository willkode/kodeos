import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';

const appTypes = ['Web Application', 'Mobile App', 'SaaS Platform', 'Marketplace', 'Internal Tool', 'Client Portal', 'Community Platform', 'E-commerce', 'Other'];
const platforms = ['Base44', 'Lovable', 'Bolt', 'Replit', 'Cursor', 'V0 by Vercel', 'Other'];
const goals = ['MVP Launch', 'Prototype', 'Full Product', 'Client Project', 'Internal Tool', 'Learning Project'];

export default function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    appType: '',
    targetUsers: '',
    targetPlatform: 'Base44',
    buildGoal: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const canProceed = step === 1
    ? form.name.trim() && form.description.trim()
    : form.appType;

  const handleCreate = async () => {
    setSaving(true);
    const project = await base44.entities.Project.create({
      ...form,
      status: 'planning',
    });
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="pt-16">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        <AnimatedText text="Create New Project" className="mb-2" />
        <p className="text-[#A1A1AA] mb-8">Let's start by defining your app idea.</p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#3B82F6]' : 'bg-white/[0.06]'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Project Name</label>
              <Input
                placeholder="e.g. Local Service Marketplace"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className="bg-card border-border/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">App Idea</label>
              <Textarea
                placeholder="Describe your app in a few sentences. What does it do? Who is it for?"
                value={form.description}
                onChange={e => update('description', e.target.value)}
                className="bg-card border-border/30 min-h-[120px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Target Users</label>
              <Input
                placeholder="e.g. Small business owners, freelancers"
                value={form.targetUsers}
                onChange={e => update('targetUsers', e.target.value)}
                className="bg-card border-border/30"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">App Type</label>
              <Select value={form.appType} onValueChange={v => update('appType', v)}>
                <SelectTrigger className="bg-card border-border/30">
                  <SelectValue placeholder="Select app type" />
                </SelectTrigger>
                <SelectContent>
                  {appTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Preferred AI Builder</label>
              <Select value={form.targetPlatform} onValueChange={v => update('targetPlatform', v)}>
                <SelectTrigger className="bg-card border-border/30">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Build Goal</label>
              <Select value={form.buildGoal} onValueChange={v => update('buildGoal', v)}>
                <SelectTrigger className="bg-card border-border/30">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : <div />}

          {step < 2 ? (
            <Button
              disabled={!canProceed}
              onClick={() => setStep(2)}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              disabled={!canProceed || saving}
              onClick={handleCreate}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {saving ? 'Creating...' : 'Create Project'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}