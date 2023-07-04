/* eslint-disable mocha/no-setup-in-describe,no-unused-expressions */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import Sinon from 'sinon';

import RequestProcessor from '../../src/pairtest/lib/RequestProcessor.js';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';

const { expect } = chai;
chai.use(sinonChai);

describe('RequestProcessor', () => {
  const spyGetTicketType = Sinon.spy(TicketTypeRequest.prototype, 'getTicketType');
  const spyGetNoOfTickets = Sinon.spy(TicketTypeRequest.prototype, 'getNoOfTickets');

  afterEach(() => {
    Sinon.resetHistory();
  });

  describe('processRequest', () => {
    it('should get the ticket type from the request', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('ADULT', 2));
      expect(info).to.haveOwnProperty('type');
      expect(info.type).to.eql('ADULT');
      expect(spyGetTicketType).to.be.calledOnce;
    });
    it('should get the number of tickets from the request', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('ADULT', 2));
      expect(info).to.haveOwnProperty('numberOfTickets');
      expect(info.numberOfTickets).to.eql(2);
      expect(spyGetNoOfTickets).to.be.calledOnce;
    });
    it('should calcualte the cost of the adult tickets', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('ADULT', 2));
      expect(info).to.haveOwnProperty('cost');
      expect(info.cost).to.eql(40);
    });
    it('should calcualte the cost of the child tickets', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('CHILD', 3));
      expect(info).to.haveOwnProperty('cost');
      expect(info.cost).to.eql(30);
    });
    it('should calcualte the cost of the infant tickets', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('INFANT', 10));
      expect(info).to.haveOwnProperty('cost');
      expect(info.cost).to.eql(0);
    });
    it('should calcualte the number of seats for adult tickets', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('ADULT', 2));
      expect(info).to.haveOwnProperty('seats');
      expect(info.seats).to.eql(2);
    });
    it('should calcualte the number of seats for child tickets', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('CHILD', 3));
      expect(info).to.haveOwnProperty('seats');
      expect(info.seats).to.eql(3);
    });
    it('should calcualte the number of seats for infant tickets', () => {
      const info = RequestProcessor.processRequest(new TicketTypeRequest('INFANT', 4));
      expect(info).to.haveOwnProperty('seats');
      expect(info.seats).to.eql(0);
    });
  });
});
