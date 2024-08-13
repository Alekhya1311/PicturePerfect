import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("submitting the form with valid credentials should redirect to homepage", async () => {
    console.info(
      "submitting the form with valid credentials should redirect to homepage"
    );
    // mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isLoggedin: true,
            status: "SUCCESS",
          }),
      })
    );

    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // fill in the form
    fireEvent.change(getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "testpassword" },
    });

    // submit the form
    fireEvent.click(getByText("Login"));

    // wait for the redirect to happen
    await waitFor(() => expect(window.location.pathname).toEqual("/"));
  });

  test("submitting the form with invalid credentials should show an error message", async () => {
    console.info(
      "submitting the form with invalid credentials should show an error message"
    );
    // mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isLoggedin: false,
            status: "FAILURE",
            message: "Invalid username or password",
          }),
      })
    );

    const { getByLabelText, getByText, getByTestId } = render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // fill in the form
    fireEvent.change(getByLabelText("Username"), {
      target: { value: "invaliduser" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "invalidpassword" },
    });

    // submit the form
    fireEvent.click(getByText("Login"));

    // wait for the error message to appear
    const errorMessage = await waitFor(() => getByTestId("login-error"));
    expect(errorMessage).toHaveTextContent("Invalid username or password");
    expect(errorMessage).toBeInTheDocument();
  });
});
