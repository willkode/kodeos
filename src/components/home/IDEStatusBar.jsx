export default function IDEStatusBar() {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-[#161B22] border-t border-[#30363D] text-xs font-jetbrains text-[#8B949E] shrink-0">
      <div className="flex items-center gap-6">
        <span>Ln 54, Col 23</span>
        <span>UTF-8</span>
        <span>CRLF</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[#00FF41] italic">Javascript</span>
        <span>Built for vibecoders.</span>
      </div>
    </div>
  );
}