/* eslint-disable mocha/no-setup-in-describe,no-unused-expressions */
import chai from 'chai';

import TicketPrices from '../../src/pairtest/lib/TicketPrices.js';

const { expect } = chai;

describe('TicketPrices', () => {
  describe('getTickerPrice', () => {
    it('should get the price of an adult ticket', () => {
      const price = TicketPrices.getTicketPrice('ADULT');
      expect(price).to.eql(20);
    });
    it('should get the price of a child ticket', () => {
      const price = TicketPrices.getTicketPrice('CHILD');
      expect(price).to.eql(10);
    });
    it('should get the price of an infant ticket', () => {
      const price = TicketPrices.getTicketPrice('INFANT');
      expect(price).to.eql(0);
    });
  });
});
