import { render, screen, fireEvent, waitFor } from "../utils";
import userEvent from "@testing-library/user-event";
import MinimalNav from "../../components/MinimalNav";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("MinimalNav", () => {
  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = "";
  });

  it("renders the logo", () => {
    render(<MinimalNav />);
    expect(screen.getByText("Studio Haus")).toBeInTheDocument();
  });

  it("renders the menu button with correct aria-label when closed", () => {
    render(<MinimalNav />);
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the menu when clicking the menu button", async () => {
    const user = userEvent.setup();
    render(<MinimalNav />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(menuButton).toHaveAttribute("aria-label", "Close menu");
  });

  it("displays all menu items when menu is open", async () => {
    const user = userEvent.setup();
    render(<MinimalNav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("menuitem", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Contact" })).toBeInTheDocument();
  });

  it("closes menu on Escape key press", async () => {
    const user = userEvent.setup();
    render(<MinimalNav />);

    // Open menu
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");

    // Menu should be closed
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("prevents body scroll when menu is open", async () => {
    const user = userEvent.setup();
    render(<MinimalNav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when menu is closed", async () => {
    const user = userEvent.setup();
    render(<MinimalNav />);

    // Open menu
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(document.body.style.overflow).toBe("hidden");

    // Close menu
    await user.click(screen.getByRole("button", { name: /close menu/i }));

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("has proper ARIA attributes for accessibility", () => {
    render(<MinimalNav />);

    // Logo link has aria-label
    expect(screen.getByLabelText(/studio haus - go to homepage/i)).toBeInTheDocument();

    // Navigation has aria-label
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("menu dialog has proper accessibility attributes", async () => {
    const user = userEvent.setup();
    render(<MinimalNav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Site navigation menu");
  });

  it("closes menu when clicking a menu item", async () => {
    const user = userEvent.setup();
    render(<MinimalNav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const homeLink = screen.getByRole("menuitem", { name: "Home" });
    await user.click(homeLink);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
