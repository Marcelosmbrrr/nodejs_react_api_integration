import { Router } from "express";
import { body } from "express-validator";
import UserController from "../Controllers/User/UserController";
import AuthController from "../Controllers/Auth/AuthController";

const createUserRequest = [
    body('name').notEmpty().withMessage("Name is required").isLength({ min: 3, max: 255 }),
    body('username').notEmpty().withMessage("Username is required").isLength({ min: 3, max: 255 }),
    body('email').notEmpty().withMessage("Email is required").isEmail(),
    body('role_id').notEmpty().withMessage("Role is required"),
    body('password').notEmpty().withMessage("Password is required").isLength({ min: 3, max: 255 })
];

const updateUserRequest = [
    body('name').notEmpty().withMessage("Name is required").isLength({ min: 3, max: 255 }),
    body('email').notEmpty().withMessage("Email is required").isEmail(),
    body('role_id').notEmpty().withMessage("Role is required")
];

const router = Router();

// Authentication
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
// User actions
router.get('/users', UserController.index);
router.get('/users/:identifier', UserController.find);
router.post('/users', createUserRequest, UserController.store);
router.patch('/users/:identifier', updateUserRequest, UserController.update);
router.delete('/users/:identifier', UserController.delete);

export { router }