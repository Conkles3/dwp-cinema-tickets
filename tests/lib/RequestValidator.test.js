/* eslint-disable mocha/no-setup-in-describe,no-unused-expressions */
import chai from 'chai';

import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js';
import RequestValidator from '../../src/pairtest/lib/RequestValidator.js';

const { expect } = chai;

describe('RequestValidator', () => {
  describe('validateRequest', () => {
    it('should not throw an error for a valid request', () => {
      expect(() => { RequestValidator.validateRequest(1, 1, 1); })
        .to.not.throw(InvalidPurchaseException);
    });
    it('should throw an error when account id is 0', () => {
      expect(() => { RequestValidator.validateRequest(0, 1, 1); })
        .to.throw(InvalidPurchaseException, 'Account ID must be a number that is greater than 0.');
    });
    it('should throw an error when account id is not a number', () => {
      expect(() => { RequestValidator.validateRequest('abc', 1, 1); })
        .to.throw(InvalidPurchaseException, 'Account ID must be a number that is greater than 0.');
    });
    it('should throw an error when total tickets is more than 20', () => {
      expect(() => { RequestValidator.validateRequest(1, 21, 1); })
        .to.throw(InvalidPurchaseException, 'Maximum number of tickets available to purchase is 20.');
    });
    it('should throw an error when no adult tickets are purchased', () => {
      expect(() => { RequestValidator.validateRequest(1, 20, 0); })
        .to.throw(InvalidPurchaseException, 'Purchase must contain at least 1 Adult ticket.');
    });
  });
});
