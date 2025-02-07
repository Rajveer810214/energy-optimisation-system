import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Lab} from '../models/lab.model.js';
import {Sensor} from '../models/sensor.model.js';
import { User } from '../models/user.model.js';
const createLab = asyncHandler(async (req, res) => {
    const { name, location, description, department } = req.body;

    if (!['Computer Science', 'IT', 'Mechanical'].includes(department)) {
        throw new ApiError(400, "Invalid department");
    }

    const lab = new Lab({ name, location, description, department });
    await lab.save();

    return res.status(201).json(new ApiResponse(201, lab, "Lab created successfully"));
});

const getAllLabs = asyncHandler(async (req, res) => {
    const { department } = req.query;
    
    const filter = department ? { department } : {}; // Filter labs based on department
    const labs = await Lab.find(filter);

    return res.status(200).json(new ApiResponse(200, labs, "All labs fetched"));
});

const getLabById = asyncHandler(async (req, res) => {
    const lab = await Lab.findById(req.params.id).populate('sensors');
    if (!lab) {
        throw new ApiError(404, "Lab not found");
    }
    return res.status(200).json(new ApiResponse(200, lab, "Lab details fetched"));
});

const updateLab = asyncHandler(async (req, res) => {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lab) {
        throw new ApiError(404, "Lab not found");
    }
    return res.status(200).json(new ApiResponse(200, lab, "Lab updated successfully"));
});

const deleteLab = asyncHandler(async (req, res) => {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) {
        throw new ApiError(404, "Lab not found");
    }
    return res.status(200).json(new ApiResponse(200, null, "Lab deleted successfully"));
});

// Sensor Operations
const addSensorToLab = asyncHandler(async (req, res) => {
    const lab = await Lab.findById(req.params.labId);
    if (!lab) {
        throw new ApiError(404, "Lab not found");
    }

    const sensor = new Sensor(req.body);
    sensor.lab = lab._id;
    await sensor.save();

    lab.sensors.push(sensor._id);
    await lab.save();

    return res.status(201).json(new ApiResponse(201, sensor, "Sensor added to lab"));
});

const getSensorsByLab = asyncHandler(async (req, res) => {
    const sensors = await Sensor.find({ lab: req.params.labId });
    return res.status(200).json(new ApiResponse(200, sensors, "Sensors for lab fetched"));
});

const addUserToLab = asyncHandler(async (req, res) => {
    const { labId, userId } = req.params;

    const lab = await Lab.findById(labId);
    if (!lab) {
        throw new ApiError(404, "Lab not found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (lab.users.includes(userId)) {
        throw new ApiError(400, "User already assigned to this lab");
    }

    lab.users.push(userId);
    await lab.save();

    return res.status(200).json(new ApiResponse(200, lab, "User added to lab successfully"));
});

const getLabsByUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Find labs that include the given userId in the "users" field
    const labs = await Lab.find({ users: userId });

    if (!labs || labs.length === 0) {
        throw new ApiError(404, "No labs found for this user");
    }

    return res.status(200).json(new ApiResponse(200, labs, "Labs found for user"));
});
const getUsersByLab = asyncHandler(async (req, res) => {
    const labId = req.params.labId;

    // Find the lab by its ID
    const lab = await Lab.findById(labId).populate('users'); // Assuming 'users' is a field that contains user references

    if (!lab) {
        throw new ApiError(404, "Lab not found");
    }

    // If the lab has no users, return a message
    if (lab.users.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No users found for this lab"));
    }

    // Return the users associated with the lab
    return res.status(200).json(new ApiResponse(200, lab.users, "Users for lab fetched"));
});

const deleteUserFromLab = asyncHandler(async (req, res) => {
    try {
        const { labId, userId } = req.params;
    
        // Find the lab and remove the user from the `users` array
        const updatedLab = await Lab.findByIdAndUpdate(
          labId,
          { $pull: { users: userId } },
          { new: true }
        );
    
        if (!updatedLab) {
          return res.status(404).json({ message: 'Lab not found' });
        }
    
        res.status(200).json(
          new ApiResponse(200, updatedLab, 'User removed from lab')
        );
      } catch (error) {
        res.status(500).json({ message: 'Error removing user', error });
      }
})

const editUserDetailsLab=asyncHandler(async(req,res)=>{
    try {
        const { userId } = req.params;
        const { email } = req.body;
    
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { email },
          { new: true }
        );
    
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json(
            new ApiResponse(200, updatedUser, 'Email updated successfully')
        );
      } catch (error) {
        res.status(500).json({ message: 'Error updating email', error });
      }
})





// Add a new sensor to a lab
const addSensor = asyncHandler(async (req, res) => {
    try {
        const { labId } = req.params;   
        const { sensorType, location, macAddress, sensorId, deviceName } = req.body;

        console.log("Received sensor data:", req.body); // Debugging

        // Check if any required field is missing
        if (!sensorType || !location || !macAddress || !sensorId || !deviceName) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newSensor = new Sensor({ 
            sensorType, 
            location, 
            macAddress, 
            sensorId, 
            deviceName, 
            lab: labId // Ensure labId is correctly associated
        });

        await newSensor.save();

        // Add sensor reference to the lab
        await Lab.findByIdAndUpdate(labId, { $push: { sensors: newSensor._id } });

        res.status(201).json({ success: true, message: "Sensor added successfully", data: newSensor });
    } catch (error) {
        console.error("Error adding sensor:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// Update a sensor
 const updateSensor = asyncHandler(async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { name, type, value } = req.body;

        const updatedSensor = await Sensor.findByIdAndUpdate(
            sensorId,
            { name, type, value },
            { new: true }
        );

        if (!updatedSensor) {
            return res.status(404).json({ success: false, message: "Sensor not found" });
        }

        res.status(200).json({ success: true, message: "Sensor updated successfully", data: updatedSensor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a sensor
const deleteSensor = asyncHandler(async (req, res) => {
    try {
        const { sensorId, labId } = req.params;

        const sensor = await Sensor.findByIdAndDelete(sensorId);
        if (!sensor) {
            return res.status(404).json({ success: false, message: "Sensor not found" });
        }

        // Remove sensor reference from the lab
        await Lab.findByIdAndUpdate(labId, { $pull: { sensors: sensorId } });

        res.status(200).json({ success: true, message: "Sensor deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export { createLab, getAllLabs, getLabById, updateLab, deleteLab, addSensorToLab, getSensorsByLab,addUserToLab,getLabsByUser, getUsersByLab,deleteUserFromLab,editUserDetailsLab,addSensor,updateSensor,deleteSensor};

