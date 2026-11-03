import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Coming soon",
  robots: { index: false },
};

/** Placeholder for every link that leads outside the homepage and the product page. */
export default function ComingSoonPage() {
  return (
    <Section labelledBy="coming-soon-title" top="md" bottom="lg">
      <Container className="flex flex-col items-start gap-stack-sm">
        <h1 id="coming-soon-title" className="text-h2-s lg:text-h2-l">
          Coming soon
        </h1>
        <p className="text-subtitle-s text-muted-foreground lg:text-subtitle-l">
          This page isn&apos;t available yet.
        </p>
        <Button asChild variant="special">
          <Link href="/">Back to home</Link>
        </Button>
      </Container>
    </Section>
  );
}
