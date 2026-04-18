import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download } from 'lucide-react';

export default function ExportTab({ project, allItems, phases, prompts }) {
  const [copied, setCopied] = useState(false);

  const buildMarkdown = () => {
    let md = `# ${project.name}\n\n`;
    md += `${project.description}\n\n`;
    md += `**Type:** ${project.appType || '—'} | **Platform:** ${project.targetPlatform || '—'} | **Goal:** ${project.buildGoal || '—'}\n\n`;

    if (allItems.pages?.length) {
      md += `## Pages\n`;
      allItems.pages.forEach(p => { md += `- **${p.pageName}**: ${p.purpose || ''}\n`; });
      md += '\n';
    }
    if (allItems.features?.length) {
      md += `## Features\n`;
      allItems.features.forEach(f => { md += `- **${f.featureName}**: ${f.description || ''}\n`; });
      md += '\n';
    }
    if (allItems.roles?.length) {
      md += `## User Roles\n`;
      allItems.roles.forEach(r => { md += `- ${r.roleName}\n`; });
      md += '\n';
    }
    if (allItems.data?.length) {
      md += `## Data Entities\n`;
      allItems.data.forEach(d => { md += `- ${d.entityName}\n`; });
      md += '\n';
    }
    if (allItems.flows?.length) {
      md += `## User Flows\n`;
      allItems.flows.forEach(f => { md += `- **${f.flowName}**: ${f.trigger || ''}\n`; });
      md += '\n';
    }
    if (allItems.integrations?.length) {
      md += `## Integrations\n`;
      allItems.integrations.forEach(i => { md += `- **${i.integrationName}**: ${i.purpose || ''}\n`; });
      md += '\n';
    }

    if (phases.length) {
      md += `---\n\n# Build Phases & Prompts\n\n`;
      phases.sort((a, b) => a.orderNumber - b.orderNumber).forEach((phase, idx) => {
        md += `## Phase ${idx + 1}: ${phase.phaseName}\n\n`;
        const pPrompts = prompts.filter(p => p.phaseId === phase.id).sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
        pPrompts.forEach((pr, j) => {
          md += `### Prompt ${idx + 1}.${j + 1}: ${pr.title}\n\n`;
          md += `\`\`\`\n${pr.promptBody}\n\`\`\`\n\n`;
        });
      });
    }

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = buildMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_build_plan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Export Project</h3>

      <div className="space-y-3">
        <Button onClick={handleCopy} variant="outline" className="w-full justify-start gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to clipboard!' : 'Copy as Markdown'}
        </Button>
        <Button onClick={handleDownload} variant="outline" className="w-full justify-start gap-2">
          <Download className="w-4 h-4" />
          Download Markdown File
        </Button>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] max-h-96 overflow-y-auto">
        <pre className="text-xs text-[#A1A1AA] whitespace-pre-wrap font-sans leading-relaxed">
          {buildMarkdown()}
        </pre>
      </div>
    </div>
  );
}