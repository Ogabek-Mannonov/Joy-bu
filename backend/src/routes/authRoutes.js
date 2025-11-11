import express from "express"
import { register, login, createAdmin, getUsers, getAdmin} from "../controllers/authController.js"

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post("/create-admin", createAdmin);
router.get("/admins", getAdmin);
router.get("/users", getUsers);

export default router;