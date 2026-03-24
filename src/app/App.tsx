import { PageContainer } from "@/components/layout/PageContainer";
import { EmailListSection } from "@/features/email";
import { SearchExperience } from "@/features/search";

export function App() {
  return (
    <PageContainer>
      <header className="page-hero">
        <p className="page-hero__eyebrow">Live search</p>
        <h1 className="page-hero__title">Find the right email, faster</h1>
        <p className="page-hero__lead">
          Search your directory with debounced suggestions. Typing filters your inbox;
          pick a suggestion to narrow by that address — or press Enter to run the search.
        </p>
        <ul className="page-hero__tips" aria-label="Tips">
          <li>Debounced suggestions</li>
          <li>Keyboard friendly</li>
          <li>Click or Enter to select</li>
        </ul>
      </header>
      <SearchExperience>
        {({ query }) => <EmailListSection query={query} />}
      </SearchExperience>
    </PageContainer>
  );
}
