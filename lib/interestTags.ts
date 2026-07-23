export const INTEREST_TAGS = [
  "Just Chat",
  "Music",
  "Movies",
  "Language Exchange",
  "Gaming",
  "Books",
  "Travel",
] as const;

export type InterestTag = (typeof INTEREST_TAGS)[number];
