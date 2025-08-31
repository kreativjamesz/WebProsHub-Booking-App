import { Booking } from "./booking";
import { User } from "./user";
import { Business } from "./business";
import { Service } from "./service";

// Extended interface for admin bookings with related data
export interface AdminBooking extends Booking {
  user: User;
  business: Business;
  service: Service;
}
