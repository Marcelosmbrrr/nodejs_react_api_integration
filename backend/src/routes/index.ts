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
router.get('/auth-data', AuthController.userAuthenticatedData);
router.post('/refresh-access-token', AuthController.refreshAccessToken);
// User actions
router.get('/user', UserController.index);
router.get('/user/:identifier', UserController.find);
router.post('/user', createUserRequest, UserController.store);
router.patch('/user/:identifier', updateUserRequest, UserController.update);
router.delete('/user/:identifier', UserController.delete);

export { router }