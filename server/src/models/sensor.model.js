import mongoose, { Schema } from "mongoose";

const SensorSchema = new Schema({
    deviceName: { type: String, required: true },
    macAddress: { type: String, required: true, unique: true },
    sensorType: { type: String, required: true },
    sensorId: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true }
}, { timestamps: true });

export const Sensor = mongoose.model('Sensor', SensorSchema);
