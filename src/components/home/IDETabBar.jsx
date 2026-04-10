export default function IDETabBar() {
  return (
    <div className="flex items-center">
      <div className="px-4 py-2.5 text-sm font-jetbrains text-[#C9D1D9] bg-[#0D1117] border-r border-[#30363D] border-b-2 border-b-[#00FF41] cursor-pointer">
        home.js
      </div>
      <div className="px-4 py-2.5 text-sm font-jetbrains text-[#8B949E] border-r border-[#30363D] hover:text-[#C9D1D9] cursor-pointer">
        pricing.md
      </div>
    </div>
  );
}