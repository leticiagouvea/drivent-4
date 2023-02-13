import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";

async function listBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const booking = await bookingRepository.findBookingByUserId(userId);

  if(!booking || !enrollment) {
    throw notFoundError();
  }

  return booking;
}

const bookingService = {
  listBooking,
};

export default bookingService;
