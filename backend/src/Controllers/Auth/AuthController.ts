import { Request, Response } from "express";
import { client as prisma } from "../../../prisma/client";
import { compare } from 'bcryptjs';
// Provider
import { CreateAccessTokenProvider } from "../../providers/CreateAccessTokenProvider";
import { CreateRefreshTokenProvider } from "../../providers/CreateRefreshTokenProvider";
// JWT verify
import { verify } from 'jsonwebtoken';

class AuthController {

    async login(req: Request, res: Response) {

        try {

            const user = await prisma.user.findFirst({
                where: {
                    email: req.body.email
                }
            });

            if (!user) {
                throw new Error('Email or password incorrect.');
            }

            const password_match = await compare(req.body.password, user.password);

            if (!password_match) {
                throw new Error('Email or password incorrect.');
            }

            // Create Access Token
            const createAccessTokenProvider = new CreateAccessTokenProvider();
            const access_token_jwt = await createAccessTokenProvider.execute(user.id);

            // Create Refresh Token
            const createRefreshToken = new CreateRefreshTokenProvider();
            const refresh_token_jwt = await createRefreshToken.execute(user.id);

            res.status(200).send({
                access_token_jwt, refresh_token_jwt, user: {
                    name: user.name,
                    email: user.email,
                    role_id: user.roleId
                }
            });

        } catch (error) {

            res.status(500).send({ message: error.message });

        }

    }

    async logout(req: Request, res: Response) {

        try {

            const bearerToken = req.cookies.access_token;

            if (!bearerToken) {
                throw new Error('Unauthorized.');
            }

            const access_token_payload = verify(bearerToken, process.env.SECRET_JWT);

            // Find refresh token in DB and turn into invalid token
            await prisma.refreshToken.update({
                where: {
                    id: access_token_payload.userId,
                },
                data: {
                    is_valid: false
                },
            });

            res.status(200).send({ message: 'Logout successful.' });

        } catch (error) {

            res.status(500).send({ message: error.message });

        }

    }

}

export default new AuthController();