import { createCn } from "cn/config";

/**
 * Names of the custom tokens defined in app/globals.css (`@theme`). Only the names live here;
 * the values stay in the token file. `cn` needs them to resolve conflicts correctly: without them
 * it reads `text-cta` as a colour and drops it next to `text-foreground`.
 * lib/utils.test.ts fails if a token is added to globals.css but not listed here.
 */
export const OCTOPUS_TOKENS = {
  spacing: [
    "gutter",
    "header",
    "section-sm",
    "section-md",
    "section-lg",
    "stack-xs",
    "stack-sm",
    "stack-md",
    "stack-lg",
    "stack-xl",
    "cards",
    "card-xs",
    "card-sm",
    "card-md",
    "card-lg",
  ],
  radius: ["card", "pill"],
  text: [
    "h1-l",
    "h1-m",
    "h1-s",
    "h2-l",
    "h2-m",
    "h2-s",
    "h3-l",
    "h3-m",
    "h3-s",
    "subtitle-l",
    "subtitle-m",
    "subtitle-s",
    "title-lg",
    "title",
    "body-lg",
    "body",
    "cta",
    "label",
    "label-xs",
  ],
  fontWeight: ["book", "medium", "bold"],
} as const;

/** Joins class names and resolves Tailwind conflicts, including the Octopus tokens. */
export const cn = createCn({
  extend: {
    theme: {
      spacing: [...OCTOPUS_TOKENS.spacing],
      radius: [...OCTOPUS_TOKENS.radius],
      text: [...OCTOPUS_TOKENS.text],
    },
    classGroups: {
      "font-weight": [{ font: [...OCTOPUS_TOKENS.fontWeight] }],
    },
  },
});
