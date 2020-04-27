import { google } from "googleapis";
import { createClient } from "@google/maps";

import { parseAddress } from "../utils";

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });

export const Google = {
  authUrl: auth.generateAuthUrl({
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    access_type: "online",
  }),
  logIn: async (code: string) => {
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });
    return { user: data };
  },
  geocode: async (address: string) => {
    const res = await maps.geocode({ address }).asPromise();
    if (res.status < 200 || res.status > 299) {
      throw new Error("Failed geocode address");
    }
    return parseAddress(res.json.results[0].address_components);
  },
};
