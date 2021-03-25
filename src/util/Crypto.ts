import { v4 as uuidv4, v4 } from "uuid";

const generateUUID = (): string => {
  return uuidv4();
};

export default {
  generateUUID,
};
