import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditProfile from "../EditProfile/editProfile";
import Cookies from "js-cookie";

jest.mock("js-cookie");

describe("EditProfile", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    window.alert.mockRestore();
  });

  test("submitting valid data should update user details", async () => {
    console.info("submitting valid data should update user details");
    Cookies.get.mockReturnValue("testToken");
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            name: "Test User",
            username: "testuser",
            email: "test@example.com",
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            status: "SUCCESS",
            log: [],
            no_of_posts: 0,
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            status: "SUCCESS",
          }),
      });

    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getByLabelText("Name:").value).toEqual("Test User");
      expect(getByLabelText("Username:").value).toEqual("testuser");
      expect(getByLabelText("Email:").value).toEqual("test@example.com");
    });

    fireEvent.change(getByLabelText("Name:"), {
      target: { value: "Updated Test User" },
    });
    fireEvent.change(getByLabelText("Email:"), {
      target: { value: "updated@example.com" },
    });

    fireEvent.click(getByText("Save Changes"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(fetch).toHaveBeenNthCalledWith(
        3,
        "http://127.0.0.1:8000/update_user_profile",
        expect.objectContaining({
          body: JSON.stringify({
            username: "testuser",
            updates: [
              { updatedColumn: "name", updatedValue: "Updated Test User" },
              { updatedColumn: "email", updatedValue: "updated@example.com" },
            ],
          }),
        })
      );
    });
  });

  test("submitting with invalid data should show an error message", async () => {
    console.info("submitting with invalid data should show an error message");
    Cookies.get.mockReturnValue("testToken");
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            name: "Test User",
            username: "testuser",
            email: "test@example.com",
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            status: "SUCCESS",
            log: [],
            no_of_posts: 0,
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            status: "FAILURE",
          }),
      });

    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getByLabelText("Name:")).toHaveValue("Test User");
      expect(getByLabelText("Username:")).toHaveValue("testuser");
      expect(getByLabelText("Email:")).toHaveValue("test@example.com");
    });
  });
});
