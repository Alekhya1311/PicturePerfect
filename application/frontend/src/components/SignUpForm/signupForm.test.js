import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignupForm from "../SignUpForm/signUpForm";

describe("SignupForm", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("submitting the form with valid data should redirect to homepage", async () => {
    console.info(
      "submitting the form with valid data should redirect to homepage"
    );
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isRegistered: true,
            status: "SUCCESS",
          }),
      })
    );

    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.change(getByLabelText("Date of Birth"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(getByLabelText("Phone Number"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(getByText("Create Account"));

    await waitFor(() => {
      expect(window.location.pathname).toEqual("/");
      console.info("Form submitted with valid data. Redirected to homepage.");
    });
  });

  test("submitting the form with invalid data should show an error message", async () => {
    console.info(
      "submitting the form with invalid data should show an error message"
    );
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isRegistered: false,
            status: "FAILURE",
            message: "Invalid data",
          }),
      })
    );

    const { getByLabelText, getByText, findByText } = render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(getByLabelText("Email Address"), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.change(getByLabelText("Date of Birth"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(getByLabelText("Phone Number"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(getByText("Create Account"));

    const errorMessage = await findByText(/Invalid data/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
