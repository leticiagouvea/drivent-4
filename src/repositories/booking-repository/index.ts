import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },    
    select: {
      id: true,
      userId: false,
      Room: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function findBookingCountByRoomId(roomId: number) {
  return prisma.booking.groupBy({
    by: ["roomId"],
    _count: {
      roomId: true,
    },
    where: {
      roomId,
    }
  });
}

async function findBookingById(bookingId: number) {
  return await prisma.booking.findFirst({
    where: {
      id: bookingId,
    }
  });
}

async function createBooking(roomId: number, userId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,      
    }
  });
}

async function updateBooking(roomId: number, bookingId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingCountByRoomId,
  findBookingById,
  createBooking,
  updateBooking
};

export default bookingRepository;
