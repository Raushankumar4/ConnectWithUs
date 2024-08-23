import dbConnection from "./db/dbConnection.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("DB CONNECTION FAILED", error.message);
  });
