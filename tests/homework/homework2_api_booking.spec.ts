import { test, expect } from '@playwright/test';
import { get } from 'http';
import { getRandomBookingId, saveToEnvFile } from '../commonFunc/common_helper';
import { Console } from 'console';

test.describe("Homework 2 - API Booking", () => {

    // Level 1: Basic HTTP GET requests
    // 1. Get a list of all bookings
    // → GET /booking
    // 2. Get details of a specific booking by ID
    // → GET /booking/{id}
    // → Try different IDs, check what happens if it doesn’t exist.
    // 3. Search bookings by first name / last name
    // → GET /booking?firstname=John&lastname=Smith

    let bookingIds: number[] = [];
    let adminToken: string;
    let bookingId: string;
    let token: string;

    test.beforeAll(async ({ request }) => {
        // Tạo booking mới
        const newBooking = {
            firstname: "Nguyen",
            lastname: "Phi Son",
            totalprice: 150,
            depositpaid: true,
            bookingdates: {
                checkin: "2023-10-01",
                checkout: "2023-10-10"
            },
            additionalneeds: "Breakfast"
        };
        const bookingRes = await request.post('https://restful-booker.herokuapp.com/booking', {
            data: newBooking,
            headers: { 'Content-Type': 'application/json' }
        });
        const bookingData = await bookingRes.json();
        bookingId = bookingData.bookingid.toString();
        // Lấy token
        const credentials = { username: "admin", password: "password123" };
        const authRes = await request.post('https://restful-booker.herokuapp.com/auth', {
            data: credentials,
            headers: { 'Content-Type': 'application/json' }
        });
        const authData = await authRes.json();
        token = authData.token;
    });

    test("Level 1: GET /booking - should return a list of all bookings", async ({ request }) => {
        const response = await request.get('https://restful-booker.herokuapp.com/booking');
        console.log("Get /booking status: " + response.status());
        expect(response.ok()).toBeTruthy(); // Check if the response is successful
        const data = await response.json();
        expect(Array.isArray(data)).toBeTruthy(); // Ensure the response is an array
    });


    test("Level 1: GET /booking/:id - should return details of a random booking", async ({ request }) => {
        // Lấy danh sách bookingIds trực tiếp trong test
        const listResponse = await request.get('https://restful-booker.herokuapp.com/booking');
        const listData = await listResponse.json();
        const bookingIds = listData.map((booking: { bookingid: any; }) => booking.bookingid);
        let bookingId = getRandomBookingId(bookingIds);
        console.log("Random booking ID: " + bookingId);

        const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
        console.log(response.status());
        if (response.ok()) {
            const data = await response.json();
            console.log(data); // Log the booking details
            expect(data).toHaveProperty('firstname'); // Check if the response has expected properties
            expect(data).toHaveProperty('lastname');
        } else {
            console.log(`Booking with ID ${bookingId} does not exist.`);
            expect(response.status()).toBe(404); // Expecting 404 for non-existing booking
        }
    });

    test("Level 1: GET /booking/:id - should return 404 for non-existing booking id", async ({ request }) => {
        let bookingId = 99999999999;

        const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
        console.log(response.status());
        if (response.ok()) {
            const data = await response.json();
            console.log(data); // Log the booking details
            expect(data).toHaveProperty('firstname'); // Check if the response has expected properties
            expect(data).toHaveProperty('lastname');
        } else {
            console.log(`Booking with ID ${bookingId} does not exist.`);
            expect(response.status()).toBe(404); // Expecting 404 for non-existing booking
        }
    });


    // ⸻
    // Level 2: Use HTTP POST and Authentication
    // 4. Create a new booking
    // → POST /booking
    // → Fill in all fields in the request body.
    // 5. Check response and extract bookingid
    // → Store the bookingid of the booking you created — use it in future tests.
    // 6. Create an auth token (login)
    // → POST /auth
    // → Use default credentials: { "username": "admin", "password": "password123" }
    // → Store the returned token.

    test("Level 2: POST /booking - should create a new booking", async ({ request }) => {
        const newBooking = {
            firstname: "Nguyen",
            lastname: "Phi Son",
            totalprice: 150,
            depositpaid: true,
            bookingdates: {
                checkin: "2023-10-01",
                checkout: "2023-10-10"
            },
            additionalneeds: "Breakfast"
        };

        const response = await request.post('https://restful-booker.herokuapp.com/booking', {
            data: newBooking,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Create booking status: " + response.status());
        expect(response.status()).toBe(200); // Expecting 200 OK for successful creation

        const data = await response.json();
        console.log(data); // Log the response data
        expect(data).toHaveProperty('bookingid'); // Check if bookingid is present

        console.log("Created booking ID: " + data.bookingid);
        saveToEnvFile('BOOKING_ID', data.bookingid.toString());
        expect(data.booking).toMatchObject(newBooking); // Verify the created booking matches the input
    });


    test("Level 2: POST /auth - should create an auth token", async ({ request }) => {
        const credentials = {
            username: "admin",
            password: "password123"
        };

        const response = await request.post('https://restful-booker.herokuapp.com/auth', {
            data: credentials,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Auth token creation status: " + response.status());
        expect(response.status()).toBe(200); // Expecting 200 OK for successful auth

        const data = await response.json();
        console.log(data); // Log the response data
        expect(data).toHaveProperty('token'); // Check if token is present
        console.log("Auth token: " + data.token);
        saveToEnvFile('ADMIN_TOKEN', data.token);
    });


    // Level 3: Update & Delete (requires auth)
    // 7. Update a booking using PUT
    // → PUT /booking/{id}
    // → Include token in Cookie: token=your_token_here
    // → Change values like firstname, totalprice, etc.
    // 8. Partially update a booking using PATCH
    // → PATCH /booking/{id}
    // → Try updating just the depositpaid or firstname.
    // 9. Delete a booking
    // → DELETE /booking/{id}
    // → Include auth token, then try fetching it again (should return 404).

    test("Level 3: PUT /booking/:id - should update an existing booking", async ({ request }) => {
        const updatedBooking = {
            firstname: "son",
            lastname: "nguyen phi",
            totalprice: 200,
            depositpaid: false,
            bookingdates: {
                checkin: "2023-11-01",
                checkout: "2023-11-15"
            },
            additionalneeds: "Late Checkout"
        };
        const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
            data: updatedBooking,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        });
        console.log("Update booking status: " + response.status());
        expect(response.status()).toBe(200);
        const data = await response.json();
        console.log(data);
        expect(data).toMatchObject(updatedBooking);
    });

    test("Level 3: PATCH /booking/:id - should partially update an existing booking", async ({ request }) => {
        const partialUpdate = { depositpaid: true };
        const response = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
            data: partialUpdate,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        });
        console.log("Partial update booking status: " + response.status());
        expect(response.status()).toBe(200);
        const data = await response.json();
        console.log(data);
        expect(data.depositpaid).toBe(true);
    });

    test("Level 3: DELETE /booking/:id - should delete an existing booking", async ({ request }) => {
        const response = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
            headers: { 'Cookie': `token=${token}` }
        });
        console.log("Delete booking status: " + response.status());
        expect(response.status()).toBe(201);
        console.log("Booking ID " + bookingId + " deleted successfully.");
        // Verify the booking is deleted by trying to fetch it again
        const getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
        console.log("Get deleted booking status: " + getResponse.status());
        expect(getResponse.status()).toBe(404);
        console.log("Verified booking ID " + bookingId + " is deleted.");
    });

    // ⸻
    // Level 4: Edge Cases & Negative Tests
    // 10. Try accessing a booking with an invalid ID
    // → e.g. GET /booking/9999999
    // → What status code do you get?
    // 11. Try creating a booking with missing fields
    // → Omit firstname or totalprice, observe what happens.
    // 12. Try updating or deleting a booking without authentication
    // → Expect a 403 Forbidden error.

    test("Level 4: GET /booking/:id - should return 404 for invalid booking id", async ({ request }) => {
        let bookingId = 9999999;

        const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
        console.log(response.status());
        expect(response.status()).toBe(404); // Expecting 404 for non-existing booking
    });

    test("Level 4: POST /booking - should return 500 when creating a booking with missing fields", async ({ request }) => {
        const incompleteBooking = {
            // firstname is missing
            lastname: "Smith",
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: "2023-10-01",
                checkout: "2023-10-10"
            },
            additionalneeds: "Breakfast"
        };

        const response = await request.post('https://restful-booker.herokuapp.com/booking', {
            data: incompleteBooking,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Create incomplete booking status: " + response.status());
        expect(response.status()).toBe(500); // Expecting 500 Internal Server Error for missing fields
    });

    test("Level 4: DELETE /booking/:id - should return 403 when deleting a booking without authentication", async ({ request }) => {
        const response = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
        console.log("Delete booking without auth status: " + response.status());
        expect(response.status()).toBe(403);
    });

});




