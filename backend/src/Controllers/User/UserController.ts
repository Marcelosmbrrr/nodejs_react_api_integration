import { Request, Response } from "express";
import { client as prisma } from "../../../prisma/client";

class UserController {

    async index(req: Request, res: Response) {

        res.send('index');

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