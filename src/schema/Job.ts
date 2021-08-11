import Mongoose from "mongoose";
const {
  Schema,
  Types: { ObjectId },
} = Mongoose;

// Register schema for Mongoose. This will be used to save entities
const JobSchema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  body: {
    description: { type: String, required: true },
    additionalInfo: { type: String },
    contactInfo: {
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    address: {
      streetaddress: { type: String },
      zipcode: { type: String },
      city: { type: String },
    },
  },
  // Register relations
  relevantDegrees: [{ type: ObjectId, ref: "Degree" }],
  relevantOrientations: [{ type: ObjectId, ref: "ActivityOrientation" }],
  author: { type: ObjectId, ref: "User", required: true },
  authorDisplayName: { type: String, required: true },
});

// Extending Mongoose.Document type so TypeScript plays nicely.
export interface JobDoc extends Mongoose.Document {
  title: string;
  companyName: string;
  body: {
    description: string;
    additionalInfo: string;
    contactInfo: {
      email: string;
      phoneNumber: string;
    };
    address: {
      streetaddress: string;
      zipcode: string;
      city: string;
    };
  };
  relevantDegrees: typeof ObjectId[];
  relevantOrientations: typeof ObjectId[];
  author: typeof ObjectId;
  authorDisplayName: string;
}

export default Mongoose.model<JobDoc>("Job", JobSchema);
