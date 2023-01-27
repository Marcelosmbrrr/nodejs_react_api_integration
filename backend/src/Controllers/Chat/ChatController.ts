import { Request, Response } from "express";
import { client as prisma } from "../../../prisma/client";

class ChatController {

    async index(req: Request, res: Response) {

        res.send('index message');

        // Proccess message with server side socket.io
        // Spread the message to connected clients

    }

}

export default new ChatController();