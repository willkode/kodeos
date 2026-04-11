import BorderGlow from './BorderGlow';

export default function AIAgentKitCard({ kit, onClick }) {
  return (
    <BorderGlow>
      <div className="p-5 cursor-pointer" onClick={() => onClick?.(kit)}>
        <h3 className="text-base font-semibold mb-2 line-clamp-2">{kit.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {kit.description}
        </p>
        <span className="text-xs text-[#3B82F6] font-medium">View details →</span>
      </div>
    </BorderGlow>
  );
}