import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';

const APP_TYPES = [
  'SaaS Platform', 'Marketplace', 'E-commerce Store', 'Dashboard / Analytics', 'CRM / Client Management',
  'Booking / Scheduling', 'Social Network', 'Learning / Education', 'Project Management',
  'Content / Blog Platform', 'Community / Forum', 'Internal Tool', 'Portfolio / Landing Page', 'Other',
];

const AUDIENCE_OPTIONS = [
  'Small Business Owners', 'Freelancers / Solopreneurs', 'Enterprise Teams', 'Students',
  'Developers', 'Creators / Artists', 'Healthcare Professionals', 'Coaches / Consultants',
  'Agencies', 'General Consumers', 'Other',
];

const ROLE_OPTIONS = [
  'Admin', 'User', 'Manager', 'Editor', 'Viewer', 'Coach', 'Client',
  'Seller', 'Buyer', 'Instructor', 'Student', 'Support Agent',
];

const PAGE_OPTIONS = [
  'Home / Landing', 'Dashboard', 'Profile', 'Settings', 'Login / Signup',
  'Admin Panel', 'Search / Browse', 'Detail / Single Item', 'Checkout / Payment',
  'Inbox / Messages', 'Calendar / Schedule', 'Reports / Analytics',
  'Onboarding', 'Help / FAQ', 'Notifications',
];

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
  { id: 'ai', label: 'AI-powered features' },
  { id: 'realtime', label: 'Real-time updates' },
];

const CORE_FEATURE_OPTIONS = [
  'User registration & profiles', 'CRUD listings (create/edit/delete items)', 'Forms & data collection',
  'Image / file gallery', 'Reviews & ratings', 'Comments / discussions',
  'Booking calendar', 'Shopping cart & checkout', 'Subscription management',
  'Drag & drop interface', 'Charts & data visualization', 'Export / PDF generation',
  'Role-based access', 'Workflow automation', 'Email templates & sending',
  'Maps & location', 'Notifications center', 'Activity feed / logs',
];

const MVP_GOALS = [
  'Launch MVP as fast as possible', 'Get to first 10 paying users',
  'Internal tool for my team', 'Validate the idea with a prototype',
  'Replace a spreadsheet / manual process', 'Build a portfolio piece',
  'Scale an existing manual service', 'Other',
];

const INITIAL = {
  appName: '',
  appType: '',
  whatItDoes: '',
  audience: [],
  roles: [],
  pages: [],
  coreFeatures: [],
  features: [],
  designStyle: 'modern-minimal',
  platform: 'both',
  mvpGoal: '',
  freeDescription: '',
};

function TogglePill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        selected
          ? 'border-[#3B82F6]/50 bg-[#3B82F6]/15 text-[#60A5FA]'
          : 'border-white/[0.06] bg-white/[0.02] text-[#A1A1AA] hover:border-white/[0.15] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function MultiPillSelect({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <TogglePill
          key={opt}
          label={opt}
          selected={selected.includes(opt)}
          onClick={() => onToggle(opt)}
        />
      ))}
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs flex items-center justify-center font-bold">{num}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function IntakeForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleItem = (key, item) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item],
    }));
  };

  const canSubmit = form.appName.trim() && (form.appType || form.whatItDoes.trim() || form.freeDescription.trim());

  return (
    <div className="space-y-8">
      {/* Section 1: What are you building */}
      <Section num={1} title="What are you building?">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">App Name *</label>
            <Input
              value={form.appName}
              onChange={e => set('appName', e.target.value)}
              placeholder="e.g. CoachHub"
              className="bg-white/[0.04] border-white/[0.08]"
            />
          </div>
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">App Type *</label>
            <Select value={form.appType} onValueChange={v => set('appType', v)}>
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                <SelectValue placeholder="Select app type..." />
              </SelectTrigger>
              <SelectContent>
                {APP_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm text-[#A1A1AA] mb-1.5 block">Short description (optional)</label>
          <Input
            value={form.whatItDoes}
            onChange={e => set('whatItDoes', e.target.value)}
            placeholder="e.g. Helps coaches manage clients and schedule sessions"
            className="bg-white/[0.04] border-white/[0.08]"
          />
        </div>
      </Section>

      {/* Section 2: Who is it for */}
      <Section num={2} title="Who is it for?">
        <label className="text-sm text-[#A1A1AA] mb-1.5 block">Target Audience (select all that apply)</label>
        <MultiPillSelect options={AUDIENCE_OPTIONS} selected={form.audience} onToggle={item => toggleItem('audience', item)} />
      </Section>

      {/* Section 3: User Roles */}
      <Section num={3} title="User Roles">
        <label className="text-sm text-[#A1A1AA] mb-1.5 block">Who uses the app? (select all that apply)</label>
        <MultiPillSelect options={ROLE_OPTIONS} selected={form.roles} onToggle={item => toggleItem('roles', item)} />
      </Section>

      {/* Section 4: Pages */}
      <Section num={4} title="Pages Needed">
        <label className="text-sm text-[#A1A1AA] mb-1.5 block">Select the pages your app needs</label>
        <MultiPillSelect options={PAGE_OPTIONS} selected={form.pages} onToggle={item => toggleItem('pages', item)} />
      </Section>

      {/* Section 5: Core Features */}
      <Section num={5} title="Core Features">
        <label className="text-sm text-[#A1A1AA] mb-1.5 block">What should your app do? (select all that apply)</label>
        <MultiPillSelect options={CORE_FEATURE_OPTIONS} selected={form.coreFeatures} onToggle={item => toggleItem('coreFeatures', item)} />
      </Section>

      {/* Section 6: Capabilities */}
      <Section num={6} title="Capabilities Needed">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleItem('features', opt.id)}
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
      </Section>

      {/* Section 7: Preferences */}
      <Section num={7} title="Preferences">
        <div className="grid md:grid-cols-3 gap-4">
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
          <div>
            <label className="text-sm text-[#A1A1AA] mb-1.5 block">MVP Goal</label>
            <Select value={form.mvpGoal} onValueChange={v => set('mvpGoal', v)}>
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                <SelectValue placeholder="Select goal..." />
              </SelectTrigger>
              <SelectContent>
                {MVP_GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Free text */}
      <div>
        <label className="text-sm text-[#A1A1AA] mb-1.5 block">Anything else? (optional)</label>
        <Textarea
          value={form.freeDescription}
          onChange={e => set('freeDescription', e.target.value)}
          placeholder="Add any extra details the selectors didn't cover..."
          className="bg-white/[0.04] border-white/[0.08] min-h-[60px]"
          rows={2}
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