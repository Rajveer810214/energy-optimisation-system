import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Lab} from '../models/lab.model.js';
import {Sensor} from '../models/sensor.model.js';
import { User } from '../models/user.model.js';
const createLab = asyncHandler(async (req, res) => {
    const lab = new Lab(req.body);
    await lab.save({ validateBeforeSave: false });
    return res.status(201).json(new ApiResponse(201, lab, "Lab created successfully"));
});

const getAllLabs = asyncHandler(async (req, res) => {
    const labs = await Lab.find().populate('sensors');
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

export { createLab, getAllLabs, getLabById, updateLab, deleteLab, addSensorToLab, getSensorsByLab,addUserToLab,getLabsByUser, getUsersByLab };

