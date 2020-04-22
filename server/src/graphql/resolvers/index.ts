import merge from "lodash.merge";
import { viewerResolvers } from "./Viewer";
import { userResolvers } from "./User";
import { listingResolvers } from "./Listings";
import { bookingResolvers } from "./Bookings";

export const resolvers = merge(
  viewerResolvers,
  userResolvers,
  listingResolvers,
  bookingResolvers
);
