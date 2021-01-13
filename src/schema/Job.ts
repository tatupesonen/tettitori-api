import Mongoose from 'mongoose';
const { Schema, Types: { ObjectId } } = Mongoose;

const JobSchema = new Schema({
    title: {type: String, required: true },
    body: {
        description: { type: String, required: true },
        contactInfo: { type: String },
        address: { type: String },
    },
    relevantDegrees: [{type: ObjectId, ref: 'Degree'}],
    author: { type: ObjectId, ref: 'User', required: true },
    authorDisplayName: { type: String, required: true }
});

export interface JobDoc extends Mongoose.Document {
    title: String,
    body: {
        description: String,
        contactInfo: String,
        address: String,
    },
    author: typeof ObjectId,
    authorDisplayName: String,
}

export default Mongoose.model<JobDoc>('Job', JobSchema);