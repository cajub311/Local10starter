import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the page heading", () => {
    render(<Home />);
    expect(screen.getByText("Local 10 Starter")).toBeInTheDocument();
  });

  it("renders the member check-in section", () => {
    render(<Home />);
    expect(screen.getByText("Member Check-In")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByText("Check In")).toBeInTheDocument();
  });

  it("renders announcements", () => {
    render(<Home />);
    expect(screen.getByText("Announcements")).toBeInTheDocument();
    expect(screen.getByText("Monthly Meeting Reminder")).toBeInTheDocument();
    expect(screen.getByText("Safety Training Update")).toBeInTheDocument();
    expect(screen.getByText("Contract Negotiations")).toBeInTheDocument();
  });

  it("handles member check-in", () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("Enter your name");
    const button = screen.getByText("Check In");

    fireEvent.change(input, { target: { value: "John Doe" } });
    fireEvent.click(button);

    expect(
      screen.getByText("Welcome, John Doe! You are checked in.")
    ).toBeInTheDocument();
  });

  it("does not greet when name is empty", () => {
    render(<Home />);
    const button = screen.getByText("Check In");

    fireEvent.click(button);

    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
  });
});
