import { http, HttpResponse } from "msw";

type SearchSuggestionEmail = {
  id: string;
  email: string;
  name: string;
};

const mockEmailSuggestions: SearchSuggestionEmail[] = [
  { id: "usr_1", email: "alice.johnson@example.com", name: "Alice Johnson" },
  { id: "usr_2", email: "alex.morgan@example.com", name: "Alex Morgan" },
  { id: "usr_3", email: "ben.thomas@example.com", name: "Ben Thomas" },
  { id: "usr_4", email: "brenda.lee@example.com", name: "Brenda Lee" },
  { id: "usr_5", email: "chris.wright@example.com", name: "Chris Wright" },
  { id: "usr_6", email: "diana.price@example.com", name: "Diana Price" },
  { id: "usr_7", email: "ella.park@example.com", name: "Ella Park" },
  { id: "usr_8", email: "ethan.cooper@example.com", name: "Ethan Cooper" },
];

export const handlers = [
  http.get("/api/search-suggestions", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim().toLowerCase() ?? "";

    const suggestions = query
      ? mockEmailSuggestions.filter(
          ({ email, name }) =>
            email.toLowerCase().includes(query) ||
            name.toLowerCase().includes(query),
        )
      : mockEmailSuggestions;

    return HttpResponse.json({
      data: suggestions.slice(0, 6),
    });
  }),
];
