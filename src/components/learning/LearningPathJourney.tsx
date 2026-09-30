"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TopicNode as TopicNodeType } from "@/lib/learning";
import { Check, Lock, Star } from "lucide-react";
import { Sage } from "@/components/brand/Mascots";

const STATE_STYLES: Record<TopicNodeType["state"], string> = {
  completed: "bg-sage text-paper",
  mastered: "bg-gold text-ink",
  current: "bg-indigo text-paper ring-4 ring-indigo/20",
  recommended: "bg-ember text-paper",
  locked: "bg-ink/10 text-ink/30",
};

const STATE_ICON = {
  completed: Check,
  mastered: Star,
  locked: Lock,
} as const;

export function LearningPathJourney({
  subjectSlug,
  nodes,
}: {
  subjectSlug: string;
  nodes: TopicNodeType[];
}) {
  const currentIndex = nodes.findIndex(
    (node) => node.state === "current" || node.state === "recommended",
  );

  const greeting =
    currentIndex === -1
      ? "Hi! Ready to keep learning?"
      : currentIndex === 0
        ? "Hi! Ready to start?"
        : "Welcome back. Ready for the next step?";

  return (
    <div className="mx-auto max-w-md py-6">
      {/* Sage introduction */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mb-6 flex items-end gap-3 px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo/10"
        >
          <Sage className="h-14 w-14" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.3,
            ease: "easeOut",
          }}
          className="relative mb-1 rounded-2xl rounded-bl-md border border-ink/10 bg-paper px-4 py-3 shadow-sm"
        >
          <p className="text-sm font-semibold leading-5 text-ink">
            {greeting}
          </p>
        </motion.div>
      </motion.div>

      {/* Learning path */}
      <ol className="flex flex-col items-center gap-2">
        {nodes.map((node, index) => {
          const isLocked = node.state === "locked";
          const isGuideNode =
            node.state === "current" || node.state === "recommended";

          const Icon =
            node.state === "completed"
              ? STATE_ICON.completed
              : node.state === "mastered"
                ? STATE_ICON.mastered
                : node.state === "locked"
                  ? STATE_ICON.locked
                  : null;

          const offset =
            index % 2 === 0
              ? "self-start ml-4"
              : "self-end mr-4";

          const content = (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.15 + index * 0.06,
                ease: "easeOut",
              }}
              className={cn(
                "flex flex-col items-center gap-2",
                offset,
              )}
            >
              <motion.div
                whileHover={!isLocked ? { scale: 1.05 } : undefined}
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full shadow-sm",
                  STATE_STYLES[node.state],
                )}
              >
                {isGuideNode ? (
                  <Sage className="h-12 w-12" />
                ) : (
                  Icon && <Icon className="h-6 w-6" />
                )}
              </motion.div>

              <div className="text-center">
                <p className="text-sm font-semibold text-ink/90">
                  {node.name}
                </p>

                <p className="text-xs text-ink/50">
                  {node.lessonsCompleted}/{node.lessonsTotal} lessons
                  {node.masteryPercent > 0 &&
                    ` · ${node.masteryPercent}% mastery`}
                </p>
              </div>
            </motion.div>
          );

          return (
            <li
              key={node.id}
              className="flex w-full flex-col items-center"
            >
              {index > 0 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + index * 0.06,
                    ease: "easeOut",
                  }}
                  className="h-8 w-1 origin-top rounded-full bg-ink/10"
                />
              )}

              {isLocked ? (
                content
              ) : (
                <Link href={`/learn/${subjectSlug}/${node.slug}`}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
