import { Request, Response } from "express";
import { client as prisma } from "../../../prisma/client";

class LoadRolesController {

    async index(req: Request, res: Response) {

        try {

            const roles = await prisma.role.findMany({
                select: {
                    id: true,
                    name: true
                }
            });

            if (!roles) {
                throw new Error('No roles found');
            }

            res.status(200).send({ roles: roles });

        } catch (error) {
            if (error.message === 'No roles found') {
                res.status(404).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }

    }

}

export default new LoadRolesController();