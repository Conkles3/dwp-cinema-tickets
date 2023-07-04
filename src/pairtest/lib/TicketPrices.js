export default class TicketPrices {
  static #prices = {
    ADULT: 20,
    CHILD: 10,
    INFANT: 0,
  };

  static getTicketPrice(ticketType) {
    return TicketPrices.#prices[ticketType];
  }
}
