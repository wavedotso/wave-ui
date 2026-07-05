import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("renders the fallback text when the image has not loaded", () => {
    // In jsdom images never fire `load`, so the fallback is the visible
    // content — this is the real contract consumers rely on.
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="Ada Byron" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("AB")).toBeInTheDocument();
  });
});
