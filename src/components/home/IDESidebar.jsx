import { ChevronDown, ChevronRight, Folder, FileText, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { base44 } from '@/api/base44Client';

const files = [
  {
    name: 'src/',
    open: true,
    children: [
      { name: 'prompts' },
      { name: 'landing_pages.js' },
      { name: 'dashboards.py' },
      { name: 'docs' },
      { name: 'multi-platform.md' },
    ]
  },
  { name: 'docs' },
  { name: 'get-started.sh' },
  { name: 'about.txt' },
];

function FileItem({ name, depth = 0 }) {
  const isFolder = !name.includes('.');
  return (
    <div
      className="flex items-center gap-2 py-1 px-2 text-sm font-jetbrains text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#1C2028] cursor-pointer transition-colors rounded"
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      {isFolder ? <Folder className="w-4 h-4 text-[#8B949E]" /> : <FileText className="w-4 h-4 text-[#8B949E]" />}
      <span>{name}</span>
    </div>
  );
}

function FolderItem({ folder, depth = 0 }) {
  const [open, setOpen] = useState(folder.open || false);
  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 text-sm font-jetbrains text-[#C9D1D9] hover:bg-[#1C2028] cursor-pointer transition-colors rounded"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown className="w-3 h-3 text-[#8B949E]" /> : <ChevronRight className="w-3 h-3 text-[#8B949E]" />}
        <Folder className="w-4 h-4 text-[#58A6FF]" />
        <span>{folder.name}</span>
      </div>
      {open && folder.children && (
        <div>
          {folder.children.map((child, i) => (
            <FileItem key={i} name={child.name} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function IDESidebar({ user }) {
  return (
    <div className="w-56 bg-[#161B22] border-r border-[#30363D] flex flex-col h-full shrink-0 hidden md:flex">
      {/* Project name */}
      <div className="px-4 py-3 text-sm font-jetbrains text-[#8B949E] border-b border-[#30363D]">
        project-kodeos/
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        <div className="flex items-center gap-1 px-3 py-1 text-xs font-jetbrains text-[#58A6FF] uppercase tracking-wider mb-1">
          <ChevronDown className="w-3 h-3" />
          <span>dend</span>
        </div>
        {files.map((item, i) =>
          item.children ? (
            <FolderItem key={i} folder={item} depth={1} />
          ) : (
            <FileItem key={i} name={item.name} depth={1} />
          )
        )}
      </div>

      {/* User section */}
      <div className="border-t border-[#30363D] p-3 space-y-1">
        {user && (
          <div className="flex items-center gap-2 text-xs font-jetbrains text-[#8B949E] px-1">
            <Settings className="w-3.5 h-3.5" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        <div
          className="flex items-center gap-2 text-xs font-jetbrains text-[#8B949E] px-1 cursor-pointer hover:text-[#C9D1D9]"
          onClick={() => base44.auth.logout()}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}