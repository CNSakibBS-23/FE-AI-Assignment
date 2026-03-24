import { PageContainer } from "@/components/layout/PageContainer";
import { SearchExperience } from "@/features/search/ui/SearchExperience";

export function App() {
  return (
    <PageContainer>
      <h1>Email Search</h1>
      <p>Type to fetch live suggestions and select a result.</p>
      <SearchExperience />
    </PageContainer>
  );
}
