import TicketPrices from './TicketPrices.js';

export default class RequestProcessor {
  static processRequest(request) {
    const type = request.getTicketType();
    const numberOfTickets = request.getNoOfTickets();
    return {
      numberOfTickets,
      type,
      cost: numberOfTickets * TicketPrices.getTicketPrice(type),
      seats: type === 'INFANT' ? 0 : numberOfTickets,
    };
  }
}
