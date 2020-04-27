import { Request } from "express";
import { Database, User } from "../types";
import { AddressComponent } from "@google/maps";

export const authorize = async (
  db: Database,
  req: Request
): Promise<User | null> => {
  const token = req.get("X-CSRF_TOKEN");
  const viewer = await db.users.findOne({ _id: req.cookies.viewer, token });
  return viewer;
};

export const parseAddress = (addressComponent: AddressComponent[]) => {
  let country = null;
  let city = null;
  let admin = null;

  for (let component of addressComponent) {
    if (component.types.includes("country")) {
      country = component.long_name;
    }
    if (component.types.includes("administrative_area_level_1")) {
      admin = component.long_name;
    }
    if (
      component.types.includes("locality") ||
      component.types.includes("postal_town")
    ) {
      city = component.long_name;
    }
  }

  return { country, city, admin };
};
