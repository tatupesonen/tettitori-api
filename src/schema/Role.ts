import Mongoose from 'mongoose';
const { Schema, Types: ObjectId } = Mongoose;

const RoleSchema = new Schema({
    name: { type: String, minlength: 5, maxlength: 100, required: true },
    isAdmin: { type: Boolean, default: false },
    permissions: {
        canCreateJobPosting: { type: Boolean, default: false }
    }
});

export interface RoleDoc extends Mongoose.Document {
    name: String,
    isAdmin: Boolean,
    canCreateJobPosting: Boolean,
};

export default Mongoose.model<RoleDoc>('Role', RoleSchema);