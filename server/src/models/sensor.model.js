import mongoose, { Schema } from "mongoose";

const SensorSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Number, default: 0 },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true }
}, { timestamps: true });

export const Sensor = mongoose.model('Sensor', SensorSchema);
