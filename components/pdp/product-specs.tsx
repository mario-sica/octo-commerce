import { useId } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductSpecGroup } from "@/types/catalog";

/**
 * PDP specifications (pdp-specs.png, spec → Accordion): one accordion item per
 * `product.pdp.specs` group, in data order, the first open. A group with several values is a
 * bulleted list, a single value is plain text. Radix wraps each trigger in an `h3`, so the
 * section has an `h2` read by screen readers only, keeping heading levels in order.
 */
export function ProductSpecs({ specs }: { specs: ProductSpecGroup[] }) {
  const titleId = useId();
  if (specs.length === 0) return null;

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="sr-only">
        Specifications
      </h2>
      <Accordion
        type="multiple"
        defaultValue={[specs[0].title]}
        className="rounded-card bg-card px-5 py-1"
      >
        {specs.map((group) => (
          <AccordionItem key={group.title} value={group.title}>
            <AccordionTrigger>{group.title}</AccordionTrigger>
            <AccordionContent>
              {group.items.length === 1 ? (
                <p>{group.items[0]}</p>
              ) : (
                <ul className="flex list-disc flex-col pl-6">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
