import Mongoose from "mongoose";
const {
  Schema,
  Types: { ObjectId },
} = Mongoose;

const ActivityOrientation = new Schema({
  title: { required: true, type: String },
});

export interface ActivityOrientation extends Mongoose.Document {
  title: { required: true; type: String };
}

export default Mongoose.model<ActivityOrientation>(
  "ActivityOrientation",
  ActivityOrientation
);
