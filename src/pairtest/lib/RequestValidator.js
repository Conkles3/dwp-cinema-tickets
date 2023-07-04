import InvalidPurchaseException from './InvalidPurchaseException.js';

export default class RequestValidator {
  static validateRequest(accountId, totalTickets, adultTickets) {
    if (!Number.isInteger(accountId) || accountId < 1) {
      throw new InvalidPurchaseException('Account ID must be a number that is greater than 0.');
    }
    if (totalTickets > 20) {
      throw new InvalidPurchaseException('Maximum number of tickets available to purchase is 20.');
    }
    if (adultTickets < 1) {
      throw new InvalidPurchaseException('Purchase must contain at least 1 Adult ticket.');
    }
  }
}
