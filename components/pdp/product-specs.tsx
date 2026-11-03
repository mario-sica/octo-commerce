import { Download } from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductDownload, ProductSpecGroup } from "@/types/catalog";

type ProductSpecsProps = {
  specs: ProductSpecGroup[];
  downloads: ProductDownload[];
};

/**
 * PDP specifications (pdp-specs.png, spec → Accordion): one accordion item per
 * `product.pdp.specs` group, in data order, the first open. A group with several values is a
 * bulleted list, a single value is plain text. Radix wraps each trigger in an `h3`, so the
 * section has an `h2` read by screen readers only, keeping heading levels in order.
 * "Downloads" is the last item (spec, Assumption 11), listing `product.pdp.downloads`.
 */
export function ProductSpecs({ specs, downloads }: ProductSpecsProps) {
  const titleId = useId();
  if (specs.length === 0 && downloads.length === 0) return null;

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="sr-only">
        Specifications
      </h2>
      <Accordion
        type="multiple"
        defaultValue={specs[0] ? [specs[0].title] : []}
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
        {downloads.length > 0 && (
          <AccordionItem value="downloads">
            <AccordionTrigger>Downloads</AccordionTrigger>
            <AccordionContent>
              {/* p-1 = outline offset + width, so the focus ring is not clipped by the
                  content's overflow-hidden. */}
              <ul className="flex flex-col gap-2 p-1">
                {downloads.map((download) => (
                  <li key={download.label}>
                    <Link
                      href={download.href}
                      className="inline-flex items-center gap-2 text-foreground underline-offset-4 hover:underline"
                    >
                      <Download aria-hidden="true" className="size-4 shrink-0" />
                      {download.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </section>
  );
}
