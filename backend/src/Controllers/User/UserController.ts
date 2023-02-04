import { Request, Response } from "express";
import { client as prisma } from "../../../prisma/client";
// Token verification provider
import { VerifyTokenProvider } from "../../providers/VerifyTokenProvider";

class UserController {

    async index(req: Request, res: Response) {

        try {

            const access_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!access_token) {
                throw new Error('Unauthorized.');
            }

            // Verify token
            const tokenVerification = new VerifyTokenProvider();
            const verification = await tokenVerification.execute(access_token);

            if (!verification) {
                throw new Error('Unauthorized.');
            }
            
            const users = prisma.user.findMany();

            if (!users) {
                throw new Error('No users found.');
            }

            res.status(200).send({ users: users });

        } catch (error) {
            res.status(500).send({ message: error.message });
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