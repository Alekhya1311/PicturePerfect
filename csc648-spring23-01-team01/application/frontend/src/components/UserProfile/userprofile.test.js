import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserProfile from "../UserProfile/profile";

// Mocking the required dependencies
jest.mock("js-cookie", () => ({
  get: (key) => {
    if (key === "username") return "testuser";
    if (key === "token") return "testtoken";
  },
}));

// Creating a mock response for the fetch API
const mockFetch = (data) =>
  Promise.resolve({
    json: () => Promise.resolve(data),
  });

describe("UserProfile", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("renders UserProfile component", () => {
    global.fetch = jest.fn(() =>
      mockFetch({
        status: "SUCCESS",
        posts: [],
        noOfPosts: 0,
      })
    );

    const { getByText } = render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    expect(getByText("Picture Perfect")).toBeInTheDocument();
  });

  test("should show an error message when no posts are found", async () => {
    global.fetch = jest.fn(() =>
      mockFetch({
        status: "SUCCESS",
        posts: [],
        noOfPosts: 0,
      })
    );

    const { getByText } = render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(
        getByText("No posts found for the corresponding user")
      ).toBeInTheDocument()
    );
  });

  test("should display fetched posts", async () => {
    const samplePosts = [
      {
        post_id: 1,
        image: "sample-image-url",
        desc: "sample-description",
        made_by: "testuser",
        no_views: 10,
        no_likes: 5,
        no_dislikes: 2,
        posted_on: "2023-05-03",
      },
    ];

    global.fetch = jest.fn(() =>
      mockFetch({
        status: "SUCCESS",
        posts: samplePosts,
        noOfPosts: 1,
      })
    );

    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getByText("sample-description")).toBeInTheDocument();
      expect(getByAltText("sample-description")).toBeInTheDocument();
    });
  });

  test("search form submits and fetches search results", async () => {
    global.fetch = jest.fn(() =>
      mockFetch({
        status: "SUCCESS",
        posts: [],
        noOfPosts: 0,
      })
    );

    const { getByPlaceholderText, getByTestId } = render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText("Images, #tags, @users"), {
      target: { value: "searchtext" },
    });

    const searchButton = getByTestId("search-button");
    fireEvent.click(searchButton);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/view_public_posts",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            limit: 5,
            offset: 0,
            searchText: "searchtext",
            sortby: "",
            sortType: "DESC",
          }),
        })
      )
    );
  });
});
