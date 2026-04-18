const STEPS = [
  { label: 'App Intake', num: 1 },
  { label: 'Blueprint', num: 2 },
  { label: 'Phase Prompts', num: 3 },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            currentStep === step.num
              ? 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30'
              : currentStep > step.num
              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
              : 'bg-white/[0.03] text-[#52525B] border border-white/[0.06]'
          }`}>
            <span className="font-bold">{step.num}</span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px ${currentStep > step.num ? 'bg-green-500/40' : 'bg-white/[0.08]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}