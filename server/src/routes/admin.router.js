import { Router } from "express";
import { createLab, getAllLabs, getLabById, updateLab, deleteLab, addSensorToLab, getSensorsByLab,addUserToLab,getLabsByUser, getUsersByLab} from "../controllers/admin.controller.js";
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
router.route("/users").get(verifyJWT(['admin']), getAllUsers); 
router.route('/labs/:labId/users').get(verifyJWT(["admin"]), getUsersByLab);


export default router