import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { client as prisma } from "../../../prisma/client";
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

        res.send('find');

    }

    async store(req: Request, res: Response) {

        res.send('store');
    }

    async update(req: Request, res: Response) {

        res.send('update');
    }

    async delete(req: Request, res: Response) {

        res.send('delete');

    }

}

export default new UserController();