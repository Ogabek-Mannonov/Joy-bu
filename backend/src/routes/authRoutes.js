import express from "express"
import { register, login, createAdmin, getUsers} from "../controllers/authController.js"

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post("/create-admin", createAdmin);
router.get("/users", getUsers);

export default router;