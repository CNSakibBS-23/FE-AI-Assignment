import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("renders the search experience heading", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Find the right email, faster",
    );
  });
});
