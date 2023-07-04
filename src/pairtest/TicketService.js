import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import RequestProcessor from './lib/RequestProcessor.js';
import RequestValidator from './lib/RequestValidator.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #paymentService = new TicketPaymentService();

  #seatReservationService = new SeatReservationService();

  #requestValidator = new RequestValidator();

  #totalNumberOfTickets = 0;

  #totalCost = 0;

  #totalNumberOfSeats = 0;

  #tickets = {
    ADULT: 0,
    CHILD: 0,
    INFANT: 0,
  };

  purchaseTickets(accountId, ...ticketTypeRequests) {
    ticketTypeRequests.forEach((request) => {
      const {
        type, numberOfTickets, cost, seats,
      } = RequestProcessor.processRequest(request);
      this.#tickets[type] += numberOfTickets;
      this.#totalNumberOfTickets += numberOfTickets;
      this.#totalCost += cost;
      this.#totalNumberOfSeats += seats;
    });

    RequestValidator.validateRequest(
      accountId,
      this.#totalNumberOfTickets,
      this.#tickets.ADULT,
      this.#tickets.INFANT,
    );

    this.#paymentService.makePayment(accountId, this.#totalCost);
    this.#seatReservationService.reserveSeat(accountId, this.#totalNumberOfSeats);

    return {
      numberOfSeats: this.#totalNumberOfSeats,
      totalCost: this.#totalCost,
      tickets: this.#tickets,
      totalNumberOfTickets: this.#totalNumberOfTickets,
    };
  }
}
