// In this file, validates config setting etc
import dotenv from "dotenv";
dotenv.config();

const validated_db_url = process.env.DATABASE_URL;
const port = process.env.PORT;
const validated_secret = process.env.JWT_SECRET_KEY;
const salt = process.env.SALT;
if (!validated_db_url || !port || !validated_secret || !salt) {
  throw new Error("One of the essensial config is missing");
}

const env = {
  DATABASE_URL: validated_db_url,
  PORT: Number(port),
  JWT_SECRET_KEY: validated_secret,
  salt: Number(salt),
};

export default env;
