import Mongoose from "mongoose";
const {
  Schema,
  Types: { ObjectId },
} = Mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 25,
    required: true,
    unique: true,
  },
  password: { type: String, minlength: 8, maxlength: 64, required: true },
  email: {
    type: String,
    default: "",
    minlength: 5,
    maxlength: 250,
    required: false,
  },
  role: { type: ObjectId, ref: "Role", required: true },
});

export interface IUser extends Mongoose.Document {
  username: String;
  password: String;
  email: String;
  role: typeof ObjectId;
}

export default Mongoose.model<IUser>("User", UserSchema);
