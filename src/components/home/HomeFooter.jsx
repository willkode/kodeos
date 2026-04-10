export default function HomeFooter() {
  return (
    <footer className="border-t border-white/[0.06] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#71717A]">© 2026 KodeOS. Built for vibecoders.</p>
        <div className="flex items-center gap-6 text-sm text-[#71717A]">
          <span className="hover:text-white cursor-pointer transition-colors">Library</span>
          <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
        </div>
      </div>
    </footer>
  );
}