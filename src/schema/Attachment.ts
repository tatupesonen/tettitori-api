import Mongoose from "mongoose";
const {
  Schema,
  Types: { ObjectId },
} = Mongoose;

const AttachmentSchema = new Schema({
  url: { type: String, required: true },
  author: { type: ObjectId, ref: "User" },
  filesize: { type: Number, required: true },
  mimetype: { type: String, required: true },
  destination: { type: String, required: true },
  path: { type: String, required: true },
  originalFileName: { type: String, required: true },
});

export interface AttachmentDoc extends Mongoose.Document {}

export default Mongoose.model<AttachmentDoc>("Attachment", AttachmentSchema);
