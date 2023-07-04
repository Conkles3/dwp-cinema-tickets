/* eslint-disable mocha/no-setup-in-describe,no-unused-expressions */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import Sinon from 'sinon';

import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

const { expect } = chai;
chai.use(sinonChai);

describe('TicketService', () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  const spyPaymentService = Sinon.spy(TicketPaymentService.prototype, 'makePayment');
  const spySeatReservationService = Sinon.spy(SeatReservationService.prototype, 'reserveSeat');

  afterEach(() => {
    Sinon.resetHistory();
  });

  describe('Ticket rules', () => {
    it('should allow purchase of one of each ticket', () => {
      const purchase = ticketService.purchaseTickets(
        1,
        new TicketTypeRequest('ADULT', 1),
        new TicketTypeRequest('CHILD', 1),
        new TicketTypeRequest('INFANT', 1),
      );
      expect(purchase.totalNumberOfTickets).to.eql(3);
    });
    it('should allow purchases of multiple adult requests', () => {
      const purchase = ticketService.purchaseTickets(
        1,
        new TicketTypeRequest('ADULT', 1),
        new TicketTypeRequest('ADULT', 2),
        new TicketTypeRequest('ADULT', 3),
      );
      expect(purchase.tickets.ADULT).to.be.eql(6);
    });
  });
  describe('Cost calculations', () => {
    const tests = [
      {
        adults: 1, children: 1, infants: 1, expectedCost: 30,
      },
      {
        adults: 10, children: 0, infants: 0, expectedCost: 200,
      },
      {
        adults: 5, children: 5, infants: 5, expectedCost: 150,
      },
      {
        adults: 2, children: 2, infants: 1, expectedCost: 60,
      },
    ];
    tests.forEach(({
      adults, children, infants, expectedCost,
    }) => {
      it(`should calculate the cost for ${adults} adults, ${children} children, ${infants} infants`, () => {
        const purchase = ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', adults),
          new TicketTypeRequest('CHILD', children),
          new TicketTypeRequest('INFANT', infants),
        );
        expect(purchase.totalCost).to.eql(expectedCost);
      });
    });
  });
  describe('Seat reservations', () => {
    const tests = [
      {
        adults: 1, children: 1, infants: 1, numberOfSeats: 2,
      },
      {
        adults: 10, children: 0, infants: 0, numberOfSeats: 10,
      },
      {
        adults: 5, children: 5, infants: 5, numberOfSeats: 10,
      },
      {
        adults: 2, children: 2, infants: 1, numberOfSeats: 4,
      },
    ];
    tests.forEach(({
      adults, children, infants, numberOfSeats,
    }) => {
      it(`should reserve seats for ${adults} adults, ${children} children, ${infants} infants`, () => {
        const purchase = ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', adults),
          new TicketTypeRequest('CHILD', children),
          new TicketTypeRequest('INFANT', infants),
        );
        expect(purchase.numberOfSeats).to.eql(numberOfSeats);
      });
    });
  });

  describe('Third party integration', () => {
    it('should call the ticket payment service', () => {
      ticketService.purchaseTickets(1, new TicketTypeRequest('ADULT', 1));
      expect(spyPaymentService).to.be.calledOnceWithExactly(1, 20);
    });
    it('should call the seat booking service', () => {
      ticketService.purchaseTickets(1, new TicketTypeRequest('ADULT', 1));
      expect(spySeatReservationService).to.be.calledOnceWithExactly(1, 1);
    });
  });
  describe('Error handling', () => {
    afterEach(() => {
      Sinon.resetHistory();
    });

    it('should not allow a non integer account ID', () => {
      expect(() => { ticketService.purchaseTickets('a'); }).to.throw(InvalidPurchaseException, 'Account ID must be a number that is greater than 0.');
      expect(spyPaymentService).to.not.be.called;
      expect(spySeatReservationService).to.not.be.called;
    });
    it('should not allow an account ID of 0 ', () => {
      expect(() => { ticketService.purchaseTickets(0); }).to.throw(InvalidPurchaseException, 'Account ID must be a number that is greater than 0.');
      expect(spyPaymentService).to.not.be.called;
      expect(spySeatReservationService).to.not.be.called;
    });
    it('should not allow no tickets to be purchased', () => {
      expect(() => { ticketService.purchaseTickets(1); }).to.throw(InvalidPurchaseException, 'Purchase must contain at least 1 Adult ticket.');
      expect(spyPaymentService).to.not.be.called;
      expect(spySeatReservationService).to.not.be.called;
    });
    it('should not allow more than 20 tickets to be purchased', () => {
      const adults = new TicketTypeRequest('ADULT', 21);
      expect(() => { ticketService.purchaseTickets(1, adults); }).to.throw(InvalidPurchaseException, 'Maximum number of tickets available to purchase is 20.');
      expect(spyPaymentService).to.not.be.calledOnce;
      expect(spySeatReservationService).to.not.be.called;
    });
    it('should not allow infant ticket with out an adult ticket', () => {
      const infants = new TicketTypeRequest('INFANT', 1);
      expect(() => { ticketService.purchaseTickets(1, infants); }).to.throw(InvalidPurchaseException, 'Purchase must contain at least 1 Adult ticket.');
      expect(spyPaymentService).to.not.be.called;
      expect(spySeatReservationService).to.not.be.called;
    });
    it('should not allow child ticket with out an adult ticket', () => {
      const children = new TicketTypeRequest('CHILD', 1);
      expect(() => { ticketService.purchaseTickets(1, children); }).to.throw(InvalidPurchaseException, 'Purchase must contain at least 1 Adult ticket.');
      expect(spyPaymentService).to.not.be.called;
      expect(spySeatReservationService).to.not.be.called;
    });
    it('should not allow more infant tickets than adult ticket', () => {
      const infants = new TicketTypeRequest('INFANT', 2);
      const adults = new TicketTypeRequest('ADULT', 1);
      expect(() => { ticketService.purchaseTickets(1, infants, adults); }).to.throw(InvalidPurchaseException, 'Cannot have more Infant Tickets than Adult Tickets.');
      expect(spyPaymentService).to.not.be.called;
      expect(spySeatReservationService).to.not.be.called;
    });
  });
});
