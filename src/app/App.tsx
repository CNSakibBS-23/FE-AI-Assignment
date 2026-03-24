import { PageContainer } from "@/components/layout/PageContainer";
import { SearchExperience } from "@/features/search/ui/SearchExperience";

export function App() {
  return (
    <PageContainer>
      <header className="page-hero">
        <p className="page-hero__eyebrow">Live search</p>
        <h1 className="page-hero__title">Find the right email, faster</h1>
        <p className="page-hero__lead">
          Search your directory with debounced suggestions. Pick a result to confirm the
          address — or press Enter to search what you typed.
        </p>
        <ul className="page-hero__tips" aria-label="Tips">
          <li>Debounced suggestions</li>
          <li>Keyboard friendly</li>
          <li>Click or Enter to select</li>
        </ul>
      </header>
      <SearchExperience />
    </PageContainer>
  );
}
