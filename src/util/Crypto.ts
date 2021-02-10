import { v4 as uuidv4, v4 } from "uuid";
import Bcrypt from "bcryptjs";

const generateUUID = (): string => {
  return uuidv4();
};

const createHash = (pw: string) => {
  return Bcrypt.hashSync(pw, Bcrypt.genSaltSync(8));
};

const isPasswordValid = (pw: string, hash: string) => {
  return Bcrypt.compareSync(pw, hash);
};

export default {
  isPasswordValid,
  createHash,
  generateUUID,
};
