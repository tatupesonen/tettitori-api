import Mongoose from 'mongoose';
const { Schema, Types: ObjectId } = Mongoose;

const JobSchema = new Schema({
    title: {type: String, required: true },
    body: String,
    author: { type: ObjectId, ref: 'User', required: true }
});

export interface JobDoc extends Mongoose.Document {
    title: String,
    body: String,
    author: typeof ObjectId
}

export default Mongoose.model<JobDoc>('Job', JobSchema);