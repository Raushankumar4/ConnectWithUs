import mongoose from "mongoose";

const dbName = "MY_DB";

const dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${dbName}`
    );
    console.log(
      `\n Mongo DB Connected !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Failed", error.message);
    process.exit(1);
  }
};

export default dbConnection;
