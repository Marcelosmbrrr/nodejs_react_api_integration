import { Request, Response } from "express";
import { client as prisma } from "../../../prisma/client";
import { compare } from 'bcryptjs';
// Provider
import { CreateAccessTokenProvider } from "../../providers/CreateAccessTokenProvider";
import { CreateRefreshTokenProvider } from "../../providers/CreateRefreshTokenProvider";
import { DecodeTokenProvider } from "../../providers/DecodeTokenProvider";
import { VerifyTokenExpirationProvider } from "../../providers/VerifyTokenExpiration";
// JWT verify
import { JwtPayload, verify } from 'jsonwebtoken';

class AuthController {

    async login(req: Request, res: Response) {

        try {

            const user = await prisma.user.findFirst({
                where: {
                    email: req.body.email
                }
            });

            if (!user) {
                throw new Error('Email or password incorrect');
            }

            const password_match = await compare(req.body.password, user.password);

            if (!password_match) {
                throw new Error('Email or password incorrect');
            }

            // Create Access Token
            const createAccessTokenProvider = new CreateAccessTokenProvider();
            const access_token_jwt = await createAccessTokenProvider.execute(user.id);

            // Create Refresh Token
            const createRefreshToken = new CreateRefreshTokenProvider();
            const refresh_token_jwt = await createRefreshToken.execute(user.id);

            if (!access_token_jwt || !refresh_token_jwt) {
                throw new Error('Token creation error');
            }

            res.status(200).send({
                access_token_jwt, refresh_token_jwt, user: {
                    name: user.name,
                    email: user.email,
                    role_id: user.roleId,
                    created_at: user.created_at
                }
            });


        } catch (error) {
            if (error.message === 'Email or password incorrect') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }

    }

    async userAuthenticatedData(req: Request, res: Response) {

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

            const userId = decoded.sub;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId),
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    name: true,
                    roleId: true,
                    created_at: true
                }
            });

            if (!user) {
                throw new Error('User not found');
            }

            res.status(200).send({
                user: {
                    name: user.name,
                    email: user.email,
                    role_id: user.roleId
                }
            });

        } catch (error) {
            if (error.message === 'Unauthorized' || error.message === 'Token is invalid' || error.message === 'User not found' || error.message === 'Token expired') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }

    }

    async refreshAccessToken(req: Request, res: Response) {

        try {

            const refresh_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!refresh_token) {
                throw new Error('Unauthorized');
            }

            // Decode token
            const tokenDecodification = new DecodeTokenProvider();
            const decoded: JwtPayload | Boolean = await tokenDecodification.execute(refresh_token);

            if (!decoded) {
                throw new Error('Token is invalid');
            }

            const tokenVerification = new VerifyTokenExpirationProvider();
            const verification = await tokenVerification.execute(decoded);

            if (!verification) {
                throw new Error('Session expired');
            }

            const refresh_token_record = await prisma.refreshToken.findUnique({
                where: {
                    id: decoded.sub, // token subject (is user id)
                },
            })

            if (!refresh_token_record) {
                throw new Error('Token is invalid');
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: refresh_token_record.userId,
                },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Create Access Token
            const createAccessTokenProvider = new CreateAccessTokenProvider();
            const access_token_jwt = await createAccessTokenProvider.execute(Number(user.id));

            // Create Refresh Token
            const createRefreshToken = new CreateRefreshTokenProvider();
            const refresh_token_jwt = await createRefreshToken.execute(Number(user.id));

            if (!access_token_jwt || !refresh_token_jwt) {
                throw new Error('Token creation error');
            }

            res.status(200).send({
                access_token_jwt, refresh_token_jwt, user: {
                    name: user.name,
                    email: user.email,
                    role_id: user.roleId
                }
            });

        } catch (error) {
            if (error.message === 'Unauthorized' || error.message === 'Token is invalid' || error.message === 'User not found' || error.message === 'Session expired') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }

        }

    }

    async logout(req: Request, res: Response) {

        try {

            const access_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

            if (!access_token) {
                throw new Error('Unauthorized');
            }

            // Verify token
            const tokenVerification = new VerifyTokenProvider();
            const verification: JwtPayload | Boolean = await tokenVerification.execute(access_token);

            if (!verification) {
                throw new Error('Token is invalid');
            }

            const userId = verification.sub;

            await prisma.refreshToken.update({
                where: {
                    userId: Number(userId)
                },
                data: {
                    is_valid: false
                },
            });

            res.status(200).send({ message: 'Logout successful.' });

        } catch (error) {

            if (error.message === 'Unauthorized' || error.message === 'Token is invalid') {
                res.status(401).send({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }

        }

    }

}

export default new AuthController();