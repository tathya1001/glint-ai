import { Dot } from "lucide-react";
import "../../app/globals.css";

export function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1">
      <div className="rounded-lg bg-transparent p-3">
        <div className="flex -space-x-2.5">
          <Dot className="h-5 w-5 animate-typing-dot-bounce" />
          <Dot className="h-5 w-5 animate-typing-dot-bounce-delay-90" />
          <Dot className="h-5 w-5 animate-typing-dot-bounce-delay-180" />
        </div>
      </div>
    </div>
  );
}
