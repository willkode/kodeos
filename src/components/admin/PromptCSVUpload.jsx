import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react';

const VALID_CATEGORIES = [
  "Idea Validation", "Product Planning", "Base44 / Lovable Build Instructions",
  "UI and Design System", "Landing Page and Marketing Site", "User Onboarding",
  "Authentication and User Accounts", "Database and Data Model", "CRUD and Workflow",
  "AI Features", "Security", "QA and Testing", "Debugging", "Code Quality",
  "Performance", "SaaS Monetization", "Admin Panel", "Integrations",
  "SEO and Content", "Conversion and Growth", "Analytics",
  "Marketplace and Templates", "Client Services", "Compliance and Trust",
  "Specialized High-Value Prompts"
];

const VALID_PLATFORMS = ["Base44", "Lovable", "Bolt", "Replit", "Floot", "Emergent.sh", "V0 by Vercel", "Vitara AI", "Rocket.new", "Meku"];
const VALID_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function parseCSVText(text) {
  const rows = [];
  let cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (current || cells.length > 0) {
        cells.push(current.trim());
        rows.push(cells);
        cells = [];
        current = '';
      }
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      current += ch;
    }
  }
  if (current || cells.length > 0) {
    cells.push(current.trim());
    rows.push(cells);
  }
  return rows;
}

export default function PromptCSVUpload({ onComplete }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const handleDownloadTemplate = () => {
    const header = 'title,description,category,content,platforms,difficulty,tags';
    const example = '"Example Prompt","A helpful prompt for building apps","AI Features","Build an AI-powered feature that...","Base44|Lovable","Intermediate","ai|automation"';
    const blob = new Blob([header + '\n' + example], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompts_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    const text = await file.text();
    const rows = parseCSVText(text);

    if (rows.length < 2) {
      setResult({ success: 0, failed: 0, errors: ['CSV must have a header row and at least one data row.'] });
      setUploading(false);
      return;
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const titleIdx = headers.indexOf('title');
    const descIdx = headers.indexOf('description');
    const catIdx = headers.indexOf('category');
    const contentIdx = headers.indexOf('content');
    const platformsIdx = headers.indexOf('platforms');
    const diffIdx = headers.indexOf('difficulty');
    const tagsIdx = headers.indexOf('tags');

    if (titleIdx === -1 || contentIdx === -1) {
      setResult({ success: 0, failed: 0, errors: ['CSV must have at least "title" and "content" columns.'] });
      setUploading(false);
      return;
    }

    let success = 0;
    let failed = 0;
    const errors = [];
    const batch = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const title = row[titleIdx] || '';
      const content = row[contentIdx] || '';

      if (!title || !content) {
        errors.push(`Row ${i + 1}: Missing title or content, skipped.`);
        failed++;
        continue;
      }

      const platforms = platformsIdx !== -1 && row[platformsIdx]
        ? row[platformsIdx].split('|').map(p => p.trim()).filter(p => VALID_PLATFORMS.includes(p))
        : ['Base44'];

      const difficulty = diffIdx !== -1 && VALID_DIFFICULTIES.includes(row[diffIdx])
        ? row[diffIdx]
        : 'Intermediate';

      const category = catIdx !== -1 && VALID_CATEGORIES.includes(row[catIdx])
        ? row[catIdx]
        : 'AI Features';

      const tags = tagsIdx !== -1 && row[tagsIdx]
        ? row[tagsIdx].split('|').map(t => t.trim()).filter(Boolean)
        : [];

      batch.push({
        title,
        description: descIdx !== -1 ? (row[descIdx] || '') : '',
        category,
        content,
        platforms,
        difficulty,
        tags,
      });
    }

    // Bulk create in batches of 50
    for (let i = 0; i < batch.length; i += 50) {
      const chunk = batch.slice(i, i + 50);
      try {
        await base44.entities.Prompt.bulkCreate(chunk);
        success += chunk.length;
      } catch (err) {
        errors.push(`Batch starting at row ${i + 2}: ${err.message}`);
        failed += chunk.length;
      }
    }

    setResult({ success, failed, errors });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    if (success > 0) onComplete?.();
  };

  return (
    <div className="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#3B82F6]" />
            Bulk Upload Prompts (CSV)
          </h3>
          <p className="text-xs text-[#71717A] mt-1">
            Columns: title, description, category, content, platforms (pipe-separated), difficulty, tags (pipe-separated)
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={handleDownloadTemplate} className="text-xs gap-1">
          <Download className="w-3 h-3" /> Template
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleUpload}
          disabled={uploading}
          className="text-sm text-[#A1A1AA] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#3B82F6] file:text-white hover:file:bg-[#2563EB] file:cursor-pointer"
        />
        {uploading && <Loader2 className="w-4 h-4 animate-spin text-[#3B82F6]" />}
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            {result.success > 0 && (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle2 className="w-4 h-4" /> {result.success} created
              </span>
            )}
            {result.failed > 0 && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertCircle className="w-4 h-4" /> {result.failed} failed
              </span>
            )}
          </div>
          {result.errors.length > 0 && (
            <div className="text-xs text-red-400/80 space-y-0.5 max-h-32 overflow-y-auto">
              {result.errors.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}