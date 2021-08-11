import { v4 as uuidv4, v4 } from "uuid";

// Return unique id using uuidv4 library
const generateUUID = (): string => {
  return uuidv4();
};

export default {
  generateUUID,
};
