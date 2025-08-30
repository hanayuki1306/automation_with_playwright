import { test, expect } from '@playwright/test';

test.describe("Learn API with playwright", () => {
    test("Get", async ({ request }) => {
        const response = await request.get('https://restful-booker.herokuapp.com/booking');
        console.log(response.json); // Log the status code
        expect(response.ok()).toBeTruthy(); // Check if the response is successful
        const data = await response.json();
        console.log(data); // Log the response data
        expect(data).toBeInstanceOf(Array); // Ensure the response is an array
    });
});