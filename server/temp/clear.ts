import { connectDatabase } from "../src/database";

require("dotenv").config();

const clear = async () => {
  try {
    console.log("clear running");
    const db = await connectDatabase();
    await db.bookings.deleteMany({});
    await db.listings.deleteMany({});
    await db.users.deleteMany({});
    console.log("clear success");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

clear();
