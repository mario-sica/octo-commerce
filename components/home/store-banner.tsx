import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import type { HomeSection } from "@/types/content";

type StoreBannerProps = Omit<
  Extract<HomeSection, { type: "store-banner" }>,
  "type"
>;

/**
 * "Find us at" store banner (spec, Assumption 23). Both photos leave plain red where the text
 * goes, so the text sits on the photo at every breakpoint: centred over the empty top of a 3:4
 * crop of the mobile photo (anchored right, where the products are) on base; on its left at 16:9
 * on `md`; on the left of the 2.4:1 wide photo from `lg`. The retailer name is styled text, as there is no logo asset.
 */
export function StoreBanner({
  title,
  wordmark,
  cta,
  image,
  imageMobile,
}: StoreBannerProps) {
  const [first, ...rest] = wordmark.split(" ");

  return (
    <Section
      labelledBy="store-title"
      className="relative border-t border-border-light bg-brand text-brand-foreground"
    >
      <ProductImage
        src={imageMobile}
        ratio="portrait"
        md={{ src: imageMobile, ratio: "landscape" }}
        lg={{ src: image, ratio: "banner" }}
        alt=""
        sizes="100vw"
        imageClassName="object-right lg:object-center"
      />

      {/* A column, so the Container spans the banner width. */}
      <div className="absolute inset-0 flex flex-col pt-stack-xl md:justify-center md:pt-0">
        <Container className="flex flex-col items-center gap-stack-sm text-center md:items-start md:text-left">
          {/* "the" and "warehouse" touch, as in the logo; the label keeps the words apart. */}
          <h2
            id="store-title"
            aria-label={`${title} ${wordmark}`}
            className="flex flex-col"
          >
            <span className="text-h3-s font-book md:text-h3-m lg:text-h3-l">
              {title}
            </span>{" "}
            <span className="text-h2-s tracking-tight md:text-h2-m lg:text-h2-l">
              <span className="font-book">{first}</span>
              <span className="font-bold">{rest.join(" ")}</span>
            </span>
          </h2>
          <Button
            asChild
            variant="special"
            className="focus-visible:outline-ring-inverse"
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </Container>
      </div>
    </Section>
  );
}
