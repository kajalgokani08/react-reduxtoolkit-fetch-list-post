import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useGetPostsQuery } from "../api/apiSlice";
import PostsList from "./PostsList";

// Mocking the useGetPostsQuery hook
jest.mock("../api/apiSlice", () => ({
  useGetPostsQuery: jest.fn(),
}));

describe("PostsList", () => {
  it("renders loading spinner while loading", async () => {
    useGetPostsQuery.mockReturnValue({
      isLoading: true,
    });

    render(<PostsList />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("renders posts when data is fetched successfully", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1", body: "Content of post 1" },
      { id: 2, title: "Post 2", body: "Content of post 2" },
    ];

    useGetPostsQuery.mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isSuccess: true,
    });

    render(<PostsList />);

    await waitFor(() => {
      const postTitles = screen.getAllByText(/Post [1-2]/i);
      expect(postTitles).toHaveLength(2);
    });
  });

  it("renders error message when there's an error", async () => {
    const mockError = "An error occurred";

    useGetPostsQuery.mockReturnValue({
      isError: true,
      error: mockError,
    });

    render(<PostsList />);

    const errorMessage = screen.getByText(mockError);
    expect(errorMessage).toBeInTheDocument();
  });
});
