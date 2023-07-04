# dwp-cinema-tickets

A code test for DWP with cinema tickets. 

## What this does

- This project has a TicketService class which takes an account ID and any number of TicketTypeRequest objects to purchase cinema tickets.

- The TicketService will total and validate the tickets and call the third party functions to complete payments and assign seats. 

## Getting started

1. Run `nvm use` to ensure you are running against the desired npm version
2. Run `npm ci` to install the dependencies
3. Run `npm test` to run tests to validate the functionality

## Assumptions

- All accounts with an id greater than zero are valid. They also have sufficient funds to pay for any no of tickets.

- The `TicketPaymentService` implementation is an external provider with no defects. You do not need to worry about how the actual payment happens.

- The payment will always go through once a payment request has been made to the `TicketPaymentService`.

- The `SeatReservationService` implementation is an external provider with no defects. You do not need to worry about how the seat reservation algorithm works.

- The seat will always be reserved once a reservation request has been made to the `SeatReservationService`.

## Constraints

- The code in the thirdparty.* packages CANNOT be modified.

- The `TicketTypeRequest` SHOULD be an immutable object.

## Your Task

Provide a working implementation of a `TicketService` that:

- Considers the above objective, business rules, constraints & assumptions.

- Calculates the correct amount for the requested tickets and makes a payment request to the `TicketPaymentService`. 

- Calculates the correct no of seats to reserve and makes a seat reservation request to the `SeatReservationService`. 

- Rejects any invalid ticket purchase requests. It is up to you to identify what should be deemed as an invalid purchase request.