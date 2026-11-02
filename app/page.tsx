import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function Home() {
  return (
    <Section labelledBy="home-title" top="md" bottom="lg">
      <Container>
        <h1 id="home-title" className="text-h2-s lg:text-h1-l">
          Octopus
        </h1>
      </Container>
    </Section>
  );
}
