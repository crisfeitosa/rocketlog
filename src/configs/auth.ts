import { env } from "../env";
import { Secret, SignOptions } from "jsonwebtoken";

export const authConfig: {
  jwt: {
    secret: Secret;
    expiresIn: SignOptions['expiresIn'];
  };
} = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: '1d',
  },
};