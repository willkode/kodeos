export default function HomeFooter() {
  return (
    <footer className="border-t border-surface-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-tertiary">© 2026 KodeOS. Built for vibecoders.</p>
        <div className="flex items-center gap-6 text-sm text-text-tertiary">
          <span className="hover:text-foreground cursor-pointer transition-colors">Library</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Pricing</span>
        </div>
      </div>
    </footer>
  );
}