import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Paperclip,
  SendIcon,
  LoaderIcon,
  Command,
  XIcon,
  Sparkles,
  Cpu,
  Bot,
  Server,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

const quickActions = [
  { icon: <Cpu className="w-4 h-4" />, label: "AI APIs", prefix: "I need AI model APIs for " },
  { icon: <Bot className="w-4 h-4" />, label: "Agent Kits", prefix: "I need agent kits for " },
  { icon: <Server className="w-4 h-4" />, label: "MCP Servers", prefix: "I need MCP servers for " },
  { icon: <Sparkles className="w-4 h-4" />, label: "Full Stack", prefix: "Recommend a full AI stack for " },
];

export default function AnimatedAIInput({ value, onChange, onSubmit, loading, placeholder }) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) onSubmit?.();
    }
  };

  const selectQuickAction = (prefix) => {
    onChange(prefix);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full space-y-4">
      {/* Ambient glow */}
      <div className="relative">
        <div className="absolute -inset-4 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[80px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[80px] animate-pulse" style={{ animationDelay: '700ms' }} />
        </div>

        <motion.div
          className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-4">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={placeholder || "Describe your app..."}
              className={cn(
                "w-full px-4 py-3",
                "resize-none",
                "bg-transparent",
                "border-none",
                "text-white/90 text-sm",
                "focus:outline-none",
                "placeholder:text-white/20",
                "min-h-[60px]"
              )}
              style={{ overflow: "hidden" }}
            />
            <AnimatePresence>
              {inputFocused && (
                <motion.span
                  className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-offset-0 ring-violet-500/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-xs text-white/30">
              <Command className="w-3.5 h-3.5" />
              <span>Enter to send</span>
            </div>

            <motion.button
              type="button"
              onClick={onSubmit}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !value.trim()}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                "flex items-center gap-2",
                value.trim()
                  ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                  : "bg-white/[0.05] text-white/40"
              )}
            >
              {loading ? (
                <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
              ) : (
                <SendIcon className="w-4 h-4" />
              )}
              <span>{loading ? "Analyzing..." : "Send"}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quick action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            type="button"
            onClick={() => selectQuickAction(action.prefix)}
            className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-sm text-white/60 hover:text-white/90 transition-all relative group border border-white/[0.05]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {action.icon}
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}