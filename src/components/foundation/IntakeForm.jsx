import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';

const FEATURE_OPTIONS = [
  { id: 'auth', label: 'User login / authentication' },
  { id: 'payments', label: 'Payments or billing' },
  { id: 'admin', label: 'Admin panel / tools' },
  { id: 'fileUploads', label: 'File uploads' },
  { id: 'emailSms', label: 'Email or SMS notifications' },
  { id: 'dashboards', label: 'Dashboards or analytics' },
  { id: 'messaging', label: 'In-app messaging' },
  { id: 'scheduling', label: 'Scheduling / bookings' },
  { id: 'search', label: 'Search / filtering' },
  { id: 'api', label: 'External API integrations' },
];

const INITIAL = {
  appName: '',
  whatItDoes: '',
  whoItIsFor: '',
  userRoles: '',
  coreFeatures: '',
  mustHavePages: '',
  designStyle: 'modern-minimal',
  platform: 'both',
  firstVersionGoal: '',
  freeDescription: '',
  features: [],
};

export default function IntakeForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleFeature = (id) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter(f => f !== id)
        : [...prev.features, id],
    }));
  };

  const canSubmit = form.appName.trim() && (form.whatItDoes.trim() || form.freeDescription.trim());

  return (
    <div className="space-y-8">
      {/* Section 1: Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs flex items-center justify-center font-bold">1</span>
          Basic Info
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">App Name *</label>
            <Input
              value={form.appName}
              onChange={e => set('appName', e.target.value)}
              placeholder="e.g. CoachHub, TaskFlow, ShopDash"
              className="bg-white/[0.04] border-white/[0.08]"
            />
          </div>
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">Who is it for?</label>
            <Input
              value={form.whoItIsFor}
              onChange={e => set('whoItIsFor', e.target.value)}
              placeholder="e.g. Freelancers, small business owners, students"
              className="bg-white/[0.04] border-white/[0.08]"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-[#A1A1AA] mb-1.5 block">What does your app do? *</label>
          <Textarea
            value={form.whatItDoes}
            onChange={e => set('whatItDoes', e.target.value)}
            placeholder="e.g. Helps coaches manage their clients, schedule sessions, and collect payments"
            className="bg-white/[0.04] border-white/[0.08] min-h-[80px]"
          />
        </div>
      </div>

      {/* Section 2: Structure */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs flex items-center justify-center font-bold">2</span>
          Structure
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">User Roles</label>
            <Input
              value={form.userRoles}
              onChange={e => set('userRoles', e.target.value)}
              placeholder="e.g. Admin, Coach, Client"
              className="bg-white/[0.04] border-white/[0.08]"
            />
          </div>
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">Must-Have Pages</label>
            <Input
              value={form.mustHavePages}
              onChange={e => set('mustHavePages', e.target.value)}
              placeholder="e.g. Dashboard, Profile, Settings, Booking"
              className="bg-white/[0.04] border-white/[0.08]"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-[#A1A1AA] mb-1.5 block">Core Features</label>
          <Textarea
            value={form.coreFeatures}
            onChange={e => set('coreFeatures', e.target.value)}
            placeholder="e.g. User signup, service listings, booking calendar, payment checkout, messaging"
            className="bg-white/[0.04] border-white/[0.08] min-h-[60px]"
          />
        </div>
      </div>

      {/* Section 3: Capabilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs flex items-center justify-center font-bold">3</span>
          Capabilities Needed
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => toggleFeature(opt.id)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-sm text-left transition-all ${
                form.features.includes(opt.id)
                  ? 'border-[#3B82F6]/50 bg-[#3B82F6]/10 text-white'
                  : 'border-white/[0.06] bg-white/[0.02] text-[#A1A1AA] hover:border-white/[0.12]'
              }`}
            >
              <Checkbox checked={form.features.includes(opt.id)} className="pointer-events-none" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 4: Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs flex items-center justify-center font-bold">4</span>
          Preferences
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">Design Style</label>
            <Select value={form.designStyle} onValueChange={v => set('designStyle', v)}>
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern-minimal">Modern & Minimal</SelectItem>
                <SelectItem value="bold-colorful">Bold & Colorful</SelectItem>
                <SelectItem value="corporate">Corporate / Professional</SelectItem>
                <SelectItem value="playful">Playful / Fun</SelectItem>
                <SelectItem value="dark-techy">Dark & Techy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">Platform</label>
            <Select value={form.platform} onValueChange={v => set('platform', v)}>
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Mobile + Desktop</SelectItem>
                <SelectItem value="desktop">Desktop Only</SelectItem>
                <SelectItem value="mobile">Mobile First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm text-[#A1A1AA] mb-1.5 block">First Version Goal</label>
          <Input
            value={form.firstVersionGoal}
            onChange={e => set('firstVersionGoal', e.target.value)}
            placeholder="e.g. Launch MVP with booking and payments in 2 weeks"
            className="bg-white/[0.04] border-white/[0.08]"
          />
        </div>
      </div>

      {/* Free text */}
      <div>
        <label className="text-sm text-[#A1A1AA] mb-1.5 block">Anything else? Describe your app idea in your own words</label>
        <Textarea
          value={form.freeDescription}
          onChange={e => set('freeDescription', e.target.value)}
          placeholder="Add any extra details, requirements, or context..."
          className="bg-white/[0.04] border-white/[0.08] min-h-[80px]"
        />
      </div>

      <Button
        onClick={() => onSubmit(form)}
        disabled={!canSubmit}
        className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-8 h-12 text-base shadow-lg shadow-[#3B82F6]/20 w-full md:w-auto"
      >
        Generate Blueprint <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}