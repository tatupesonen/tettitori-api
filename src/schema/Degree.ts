import Mongoose from 'mongoose';
const { Schema, Types: { ObjectId } } = Mongoose;

const DegreeSchema = new Schema({
    title: { type: String, required: true }
});

export interface DegreeDoc extends Mongoose.Document {
    title: { type: String, required: true },
}

export default Mongoose.model<DegreeDoc>('Degree', DegreeSchema);