import mongoose from 'mongoose';

const LabSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    department: { type: String, required: true, enum: ['Computer Science', 'IT', 'Mechanical'] }, // Now a string
    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Lab = mongoose.model('Lab', LabSchema);
