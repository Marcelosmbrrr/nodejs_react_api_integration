import { Request, Response } from "express";
import { client as prisma } from "../../../prisma/client";

class MessageController {

    async index(req: Request, res: Response) {

        try {

            console.log(req.body)

        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

}

export default new MessageController();