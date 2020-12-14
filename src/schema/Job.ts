import Mongoose from 'mongoose';
const { Schema, Types: ObjectId } = Mongoose;

const JobSchema = new Schema({
    title: String,
    body: String,
});

export interface JobDoc extends Mongoose.Document {
    title: String,
    body: String,
}

export default Mongoose.model<JobDoc>('Job', JobSchema);