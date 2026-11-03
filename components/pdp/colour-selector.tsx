"use client";

import { useId, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Colour } from "@/types/catalog";

/**
 * PDP colour selector (spec → Colour selector): a radiogroup of swatches labelled by the visible
 * "Colour - {name}" text, which follows the selection. Each swatch is named by its colour. The
 * swatch colour comes from data, so it is the one inline style allowed.
 */
export function ColourSelector({ colours }: { colours: Colour[] }) {
  const [selected, setSelected] = useState(colours[0]?.name ?? "");
  const labelId = useId();
  // A product with no colours in its data has nothing to choose.
  if (colours.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p id={labelId} className="text-body font-book text-muted-foreground">
        Colour - {selected}
      </p>
      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        aria-labelledby={labelId}
      >
        {colours.map((colour) => (
          <RadioGroupItem
            key={colour.name}
            value={colour.name}
            aria-label={colour.name}
          >
            <span
              aria-hidden="true"
              className="size-7.5 rounded-full border border-swatch-stroke"
              style={{ backgroundColor: colour.hex }}
            />
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  );
}
