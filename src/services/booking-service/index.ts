import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { forbiddenError } from "@/errors/forbidden-error";

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const booking = await bookingRepository.findBookingByUserId(userId);

  if(!booking || !enrollment) {
    throw notFoundError();
  }

  return booking;
}

async function createBooking(roomId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const room = await hotelRepository.findRoomById(roomId); 

  if(!room || !enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.findBookingByUserId(userId);
  const capacity = await bookingRepository.findBookingCountByRoomId(roomId);

  if(capacity[0]?._count.roomId === room.capacity || booking) {
    throw forbiddenError();
  }

  await bookingRepository.createBooking(roomId, userId);

  const result = await bookingRepository.findBookingByUserId(userId);

  return result; 
}

async function updateBooking(roomId: number, userId: number, bookingId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const room = await hotelRepository.findRoomById(roomId);

  if(!room || !enrollment) {
    throw notFoundError();
  }
  
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if(!ticket || ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const bookingByUserId = await bookingRepository.findBookingByUserId(userId);
  const capacity = await bookingRepository.findBookingCountByRoomId(roomId);
  const bookingById = await bookingRepository.findBookingById(bookingId);

  if(capacity[0]?._count.roomId === room.capacity || !bookingByUserId || !bookingById) {
    throw forbiddenError();
  }

  if(roomId === bookingByUserId.Room.id) {
    throw forbiddenError();
  }

  await bookingRepository.updateBooking(roomId, bookingId);
  
  const result = await bookingRepository.findBookingByUserId(userId);

  return result; 
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking
};

export default bookingService;
