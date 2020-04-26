import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { Listing, Database, User } from "../../../lib/types";
import {
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsArgs,
  ListingsData,
  ListingsArgsFilter,
} from "./types";
import { ObjectId } from "mongodb";
import { authorize } from "../../../lib/utils";

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) });
        if (!listing) {
          throw new Error("Listing not found!");
        }
        const viewer = await authorize(db, req);
        if (viewer && viewer._id === listing.host) {
          listing.authorized = true;
        }
        return listing;
      } catch (error) {
        throw new Error(`Failed query listing ${error}!`);
      }
    },
    listings: async (
      _root: undefined,
      { filter, limit, page }: ListingsArgs,
      { db }: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const data: ListingsData = {
          total: 0,
          result: [],
        };
        let cursor = await db.listings.find({});
        if (filter && filter === ListingsArgsFilter.PRICE_LOW_TO_HIGH) {
          cursor = cursor.sort({ price: 1 });
        }
        if (filter && filter === ListingsArgsFilter.PRICE_HIGH_TO_LOW) {
          cursor = cursor.sort({ price: -1 });
        }
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);
        data.total = await cursor.count();
        data.result = await cursor.toArray();
        return data;
      } catch (error) {
        throw new Error(`Failed to query listings ${error}`);
      }
    },
  },

  Listing: {
    id: (listing: Listing): string => listing._id.toHexString(),
    host: async (
      listing: Listing,
      _args: {},
      { db }: { db: Database }
    ): Promise<User> => {
      const host = await db.users.findOne({ _id: listing.host });
      if (!host) {
        throw new Error("Host not found!");
      }
      return host;
    },
    bookingsIndex: (listing: Listing) => {
      return JSON.stringify(listing.bookingsIndex);
    },
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: { db: Database }
    ): Promise<ListingBookingsData | null> => {
      try {
        if (!listing.authorized) {
          return null;
        }
        const data: ListingBookingsData = {
          total: 0,
          result: [],
        };
        let cursor = await db.bookings.find({ _id: { $in: listing.bookings } });
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);
        data.total = await cursor.count();
        data.result = await cursor.toArray();
        return data;
      } catch (error) {
        throw new Error(`Failed to query listing bookings ${error}`);
      }
    },
  },
};
