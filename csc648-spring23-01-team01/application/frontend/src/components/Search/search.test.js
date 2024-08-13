import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Search from "./search";
import Cookies from "js-cookie";

jest.mock("js-cookie");

describe("Search", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    window.alert.mockRestore();
  });

  test("submitting a search query should fetch search results and testing if clicking category works", async () => {
    console.info(
      "submitting a search query should fetch search results and testing if clicking category works"
    );
    Cookies.get.mockReturnValue("testToken");
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            categories: ["Nature", "City"],
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            status: "SUCCESS",
            posts: [
              {
                post_id: 1,
                image: "testImageURL",
                desc: "Test description",
                made_by: "TestUser",
                no_views: 5,
                no_likes: 3,
                no_dislikes: 1,
                creation_date: "2023-01-01",
                category: "Nature",
              },
            ],
          }),
      });

    const { getByPlaceholderText, getByText, getByTestId } = render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getByText("Nature")).toBeInTheDocument();
      expect(getByText("City")).toBeInTheDocument();
    });

    fireEvent.change(getByPlaceholderText("Images, #tags, @users"), {
      target: { value: "test" },
    });

    const searchButton = getByTestId("search-button");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        "http://127.0.0.1:8000/view_public_posts",
        expect.objectContaining({
          body: JSON.stringify({
            limit: 5,
            offset: 0,
            searchText: "test",
            sortby: "",
            sortType: "DESC",
            category: "",
          }),
        })
      );
    });
  });
});
