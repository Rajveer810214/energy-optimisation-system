import mongoose, { Schema } from "mongoose";

const LabSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String },
    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Add users array
}, { timestamps: true });

export const Lab = mongoose.model('Lab', LabSchema);
