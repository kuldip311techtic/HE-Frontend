import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Notification } from "@/components/ui/Notification";

describe("Notification", () => {
  it("announces a success message as a status", () => {
    render(
      <Notification variant="success" message="Signed in successfully." />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Signed in successfully.",
    );
  });

  it("announces an error message as an alert", () => {
    render(
      <Notification variant="error" message="Invalid email or password." />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Invalid email or password.",
    );
  });

  it("calls onDismiss from the dismiss control", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Notification
        variant="success"
        message="Signed in successfully."
        onDismiss={onDismiss}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
