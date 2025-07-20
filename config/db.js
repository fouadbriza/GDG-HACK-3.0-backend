import { connect } from "mongoose"

const connectToDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Connected to the Database ...");
  } catch (error) {
    console.error(error.message);
  }
}

export default connectToDB;