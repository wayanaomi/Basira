/**
 * ISOLATED MARKETING MOCK DATA — for landing-page visualization only.
 * Never imported by authenticated app code, never used as seed data, never
 * presented as real user activity. See Master Prompt §59 / docs/DECISIONS.md.
 */
export const heroDemo = {
  streak: 14,
  xp: 2480,
  todaysFocus: "Physics · Waves",
  masteryPercent: 72,
  badgesEarned: 7,
};

export const statBar = [
  { value: "92%", label: "got measurably better within 30 days of keeping their streak" },
  { value: "14 days", label: "the average streak before someone tells a friend about Basira" },
  { value: "6 exams", label: "currently being quietly dismantled, topic by topic" },
];

export const testimonials = [
  {
    quote:
      "I have never once opened a textbook for fun. I open Basira for fun. I don't know what happened to me.",
    name: "Fatimah",
    context: "Year 11",
  },
  {
    quote: "I've missed actual deadlines. I have never once missed my streak here. Make it make sense.",
    name: "Davidson",
    context: "A-Level student",
  },
];
