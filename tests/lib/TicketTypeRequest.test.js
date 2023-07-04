/* eslint-disable mocha/no-setup-in-describe,no-unused-expressions,no-new */
import chai from 'chai';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';

const { expect } = chai;

describe('TicketTypeRequest', () => {
  describe('constructor', () => {
    it('should not throw an error when type and noOfTickets are valid', () => {
      expect(() => { new TicketTypeRequest('ADULT', 1); }).to.not.throw(TypeError);
    });
    it('should throw an error when type is not valid', () => {
      expect(() => { new TicketTypeRequest('senior', 1); }).to.throw(TypeError, 'type must be ADULT, CHILD, or INFANT');
    });
    it('should throw an error when noOfTickets is not valid', () => {
      expect(() => { new TicketTypeRequest('ADULT', 'one'); }).to.throw(TypeError, 'noOfTickets must be an integer');
    });
  });
  describe('getNoOfTickets', () => {
    it('should set and then return noOfTickets', () => {
      const request = new TicketTypeRequest('ADULT', 2);
      expect(request.getNoOfTickets()).to.eql(2);
    });
    it('should set and then return ticketType', () => {
      const request = new TicketTypeRequest('ADULT', 2);
      expect(request.getTicketType()).to.eql('ADULT');
    });
  });
});
