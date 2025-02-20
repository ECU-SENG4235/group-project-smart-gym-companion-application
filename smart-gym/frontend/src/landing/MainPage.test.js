import React from "react";
import { render, screen } from "@testing-library/react";
import MainPage from "./MainPage";
import { act } from "react-dom/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

jest.useFakeTimers();

describe("MainPage", () => {
    test("updates current date and time every second", () => {
        render(<MainPage />);

        const dateTimeElement = screen.getByText(/Loading workouts.../i).previousSibling;

        // Initial render
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        expect(dateTimeElement.textContent).toBe(`${formattedDate} | ${formattedTime}`);

        // Advance time by another second
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const newTime = new Date(now.getTime() + 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        expect(dateTimeElement.textContent).toBe(`${formattedDate} | ${newTime}`);
    });

    jest.useFakeTimers();
    jest.mock("axios");

    describe("MainPage", () => {
        test("updates current date and time every second", () => {
            render(<MainPage />);

            const dateTimeElement = screen.getByText(/Loading workouts.../i).previousSibling;

            // Initial render
            act(() => {
                jest.advanceTimersByTime(1000);
            });

            const now = new Date();
            const formattedDate = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
            const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

            expect(dateTimeElement.textContent).toBe(`${formattedDate} | ${formattedTime}`);

            // Advance time by another second
            act(() => {
                jest.advanceTimersByTime(1000);
            });

            const newTime = new Date(now.getTime() + 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

            expect(dateTimeElement.textContent).toBe(`${formattedDate} | ${newTime}`);
        });

        test("fetches and displays today's workouts and calories", async () => {
            const mockWorkouts = [
                { type: "Running", duration: 30 },
                { type: "Cycling", duration: 45 }
            ];
            const mockCalories = { totalCalories: 1500 };

            axios.get.mockImplementation((url) => {
                if (url.includes("/api/workouts")) {
                    return Promise.resolve({ data: mockWorkouts });
                }
                if (url.includes("/api/calories")) {
                    return Promise.resolve({ data: mockCalories });
                }
            });

            render(<MainPage />);

            await waitFor(() => {
                expect(screen.getByText("• Running (30 mins)")).toBeInTheDocument();
                expect(screen.getByText("• Cycling (45 mins)")).toBeInTheDocument();
                expect(screen.getByText("Total Calories Today: 1500")).toBeInTheDocument();
            });
        });

        test("displays error message when fetching data fails", async () => {
            axios.get.mockRejectedValue(new Error("Network Error"));

            render(<MainPage />);

            await waitFor(() => {
                expect(screen.getByText("Error loading workouts")).toBeInTheDocument();
                expect(screen.getByText("Error loading calories")).toBeInTheDocument();
            });
        });
    });
});