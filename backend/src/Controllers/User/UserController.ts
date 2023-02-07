import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { client as prisma } from "../../../prisma/client";
import { hash } from 'bcryptjs';
// Token verification provider
import { DecodeTokenProvider } from "../../providers/DecodeTokenProvider";
import { VerifyTokenExpirationProvider } from "../../providers/VerifyTokenExpiration";

class UserController {

    async index(req: Request, res: Response) {

        try {

            const access_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!access_token) {
                throw new Error('Unauthorized');
            }

            // Decode token
            const tokenDecodification = new DecodeTokenProvider();
            const decoded: JwtPayload | Boolean = await tokenDecodification.execute(access_token);

            if (!decoded) {
                throw new Error('Token is invalid');
            }

            // Verify token expiration
            const tokenVerification = new VerifyTokenExpirationProvider();
            const verification = await tokenVerification.execute(decoded);

            if (!verification) {
                throw new Error('Token expired');
            }

            const users = await prisma.user.findMany({
                where: {
                    deleted: false
                },
                include: {
                    role: true
                }
            });

            if (!users) {
                throw new Error('No users found');
            }

            res.status(200).send({ users: users });

        } catch (error) {
            if (error.message === 'Unauthorized' || error.message === 'Token is invalid' || error.message === 'Token expired' || error.message === 'No users found') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }

    }

    async find(req: Request, res: Response) {

        try {

            const access_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!access_token) {
                throw new Error('Unauthorized');
            }

            // Decode token
            const tokenDecodification = new DecodeTokenProvider();
            const decoded: JwtPayload | Boolean = await tokenDecodification.execute(access_token);

            if (!decoded) {
                throw new Error('Token is invalid');
            }

            // Verify token expiration
            const tokenVerification = new VerifyTokenExpirationProvider();
            const verification = await tokenVerification.execute(decoded);

            if (!verification) {
                throw new Error('Token expired');
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: req.body.id
                }
            });

            if (!user) {
                throw new Error('No user found');
            }

            res.status(200).send({ user: user });

        } catch (error) {
            if (error.message === 'Unauthorized' || error.message === 'Token is invalid' || error.message === 'Token expired' || error.message === 'No user found') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }

    }

    async store(req: Request, res: Response) {

        try {

            const access_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!access_token) {
                throw new Error('Unauthorized');
            }

            // Decode token
            const tokenDecodification = new DecodeTokenProvider();
            const decoded: JwtPayload | Boolean = await tokenDecodification.execute(access_token);

            if (!decoded) {
                throw new Error('Token is invalid');
            }

            // Verify token expiration
            const tokenVerification = new VerifyTokenExpirationProvider();
            const verification = await tokenVerification.execute(decoded);

            if (!verification) {
                throw new Error('Token expired');
            }

            const username = `@${req.body.name.split(" ")[0].toLowerCase()}`;

            const user = await prisma.user.create({
                data: {
                    email: req.body.email,
                    name: req.body.name,
                    username: username,
                    roleId: Number(req.body.role_id),
                    password: await hash('12345', 8)
                }
            });

            res.status(200).send({ message: 'User successful created', user: user });

        } catch (error) {
            if (error.message === 'Unauthorized' || error.message === 'Token is invalid' || error.message === 'Token expired') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }
    }

    async update(req: Request, res: Response) {

        try {

            const access_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!access_token) {
                throw new Error('Unauthorized');
            }

            // Decode token
            const tokenDecodification = new DecodeTokenProvider();
            const decoded: JwtPayload | Boolean = await tokenDecodification.execute(access_token);

            if (!decoded) {
                throw new Error('Token is invalid');
            }

            // Verify token expiration
            const tokenVerification = new VerifyTokenExpirationProvider();
            const verification = await tokenVerification.execute(decoded);

            if (!verification) {
                throw new Error('Token expired');
            }

            const username = `@${req.body.name.split(" ")[0].toLowerCase()}`;

            const user = await prisma.user.update({
                where: {
                    id: Number(req.params.identifier)
                },
                data: {
                    email: req.body.email,
                    name: req.body.name,
                    username: username,
                    roleId: Number(req.body.role_id)
                }
            });

            res.status(200).send({ message: 'User successful updated', user: user });

        } catch (error) {
            if (error.message === 'Unauthorized' || error.message === 'Token is invalid' || error.message === 'Token expired') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }
    }

    async delete(req: Request, res: Response) {

        try {

            const access_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!access_token) {
                throw new Error('Unauthorized');
            }

            // Decode token
            const tokenDecodification = new DecodeTokenProvider();
            const decoded: JwtPayload | Boolean = await tokenDecodification.execute(access_token);

            if (!decoded) {
                throw new Error('Token is invalid');
            }

            // Verify token expiration
            const tokenVerification = new VerifyTokenExpirationProvider();
            const verification = await tokenVerification.execute(decoded);

            if (!verification) {
                throw new Error('Token expired');
            }

            const user = await prisma.user.update({
                where: {
                    id: Number(req.params.identifier)
                },
                data: {
                    deleted: true
                }
            });

            res.status(200).send({ message: 'User successful deleted', user: user });

        } catch (error) {
            if (error.message === 'Unauthorized' || error.message === 'Token is invalid' || error.message === 'Token expired') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }

    }

}

export default new UserController();