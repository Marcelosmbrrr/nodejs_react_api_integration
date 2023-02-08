/**
 * Required External Modules
 * 
 * express: Fast, unopinionated, minimalist web framework for Node.js.
 * dotenv: Zero-dependency module that loads environment variables from a .env file into process.env
 * cors: Express middleware to enable CORS with various options.
 * helmet: Express middleware to secure your apps by setting various HTTP headers, which mitigate common attack vectors.
 * Server: socket io server for websockets
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

import { router } from "./routes";

/**
 * App Variables
 */

if (!process.env.APP_PORT) {
    process.exit(1);
}

const app = express();
const http = createServer(app);

/**
 *  App Configuration
 */

app.use(helmet()); // use helmet as default 
app.use(cors()); // use cors as default (enable all external domains)
app.use(express.json()); // parses incoming JSON data

/**
 *  App Routes
 */

app.use('/api', router);

/**
 * Server Activation
 */

http.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${process.env.APP_PORT}`);
});

/*
* Sockets server initialization
*/

const SocketIoServer = new Server(http, {
    cors: {
        origin: "*"
    }
});
export { SocketIoServer };