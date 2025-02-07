import { Router } from "express";
import { createLab, getAllLabs, getLabById, updateLab, deleteLab, addSensorToLab, getSensorsByLab,addUserToLab,getLabsByUser, getUsersByLab,deleteUserFromLab,editUserDetailsLab,addSensor,updateSensor,deleteSensor} from "../controllers/admin.controller.js";
import { getAllUsers } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/Auth.middleware.js";

const router=Router()

// Lab routes
router.post('/labs',verifyJWT(['admin']), createLab);
router.get('/labs', verifyJWT(['admin', 'user']),getAllLabs);
router.get('/labs/:id', verifyJWT(['admin', 'user']),getLabById);
router.put('/labs/:id', verifyJWT(['admin']),updateLab);
router.delete('/labs/:id',verifyJWT(['admin']),deleteLab);

// Sensor routes (as sensors belong to labs)
router.post('/labs/:labId/sensors', verifyJWT(['admin']),addSensorToLab);
router.get('/labs/:labId/sensors',verifyJWT (['admin', 'user']),getSensorsByLab);



//user add to lab and show
router.post('/labs/:labId/users/:userId', addUserToLab);
router.get('/labs/user/:userId', getLabsByUser);
router.get("/users",verifyJWT(['admin']), getAllUsers); 
router.route('/labs/:labId/users').get(verifyJWT(["admin",'user']), getUsersByLab);

router.delete('/labs/:labId/users/:userId',verifyJWT(['admin']),deleteUserFromLab);
router.patch('/users/:userId/email',verifyJWT(['admin']),editUserDetailsLab);

//sensor update or delete



// Add a new sensor to a lab
router.post('/labs/:labId/sensors',verifyJWT(['admin']), addSensor);

// Update a sensor
router.put('/sensors/:sensorId',verifyJWT(['admin']), updateSensor);

// Delete a sensor
router.delete('/labs/:labId/sensors/:sensorId',verifyJWT(['admin']), deleteSensor);
export default router