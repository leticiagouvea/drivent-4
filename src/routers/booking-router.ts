import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postBooking, getBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .get("/", postBooking);

export { bookingRouter };
