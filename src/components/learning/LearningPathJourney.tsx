import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TopicNode as TopicNodeType } from "@/lib/learning";
import { Check, Lock, Sparkles, Star } from "lucide-react";

const STATE_STYLES: Record<TopicNodeType["state"], string> = {
  completed: "bg-sage text-paper",
  mastered: "bg-gold text-ink",
  current: "bg-indigo text-paper ring-4 ring-indigo/20",
  recommended: "bg-ember text-paper",
  locked: "bg-ink/10 text-ink/30",
};

const STATE_ICON: Record<TopicNodeType["state"], React.ElementType> = {
  completed: Check,
  mastered: Star,
  current: Sparkles,
  recommended: Sparkles,
  locked: Lock,
};

export function LearningPathJourney({
  subjectSlug,
  nodes,
}: {
  subjectSlug: string;
  nodes: TopicNodeType[];
}) {
  return (
    <ol className="mx-auto flex max-w-md flex-col items-center gap-2 py-6">
      {nodes.map((node, index) => {
        const Icon = STATE_ICON[node.state];
        const isLocked = node.state === "locked";
        const offset = index % 2 === 0 ? "self-start ml-4" : "self-end mr-4";

        const content = (
          <div className={cn("flex flex-col items-center gap-2", offset)}>
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full shadow-sm transition-transform",
                STATE_STYLES[node.state],
                !isLocked && "hover:scale-105",
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-ink/90">{node.name}</p>
              <p className="text-xs text-ink/50">
                {node.lessonsCompleted}/{node.lessonsTotal} lessons
                {node.masteryPercent > 0 && ` · ${node.masteryPercent}% mastery`}
              </p>
            </div>
          </div>
        );

        return (
          <li key={node.id} className="flex w-full flex-col items-center">
            {index > 0 && <div className="h-8 w-1 rounded-full bg-ink/10" />}
            {isLocked ? (
              content
            ) : (
              <Link href={`/learn/${subjectSlug}/${node.slug}`}>{content}</Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
