import Mongoose from "mongoose";
const {
  Schema,
  Types: { ObjectId },
} = Mongoose;

const RoleSchema = new Schema({
  name: { type: String, minlength: 5, maxlength: 100, required: true },
  isAdmin: { type: Boolean, default: false },
  permissions: {
    canCreateJobPosting: { type: Boolean, default: false },
  },
});

export interface IRole {
  _id: typeof ObjectId;
  name: String;
  isAdmin: Boolean;
  canCreateJobPosting: Boolean;
}

export default Mongoose.model<IRole & Mongoose.Document>("Role", RoleSchema);
