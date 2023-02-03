import { client as prisma } from '../../prisma/client';
import dayjs from 'dayjs';
// JWT
import { sign } from 'jsonwebtoken';

/*
- This class is used to create an refresh token
- Its used to recreat the access token after it expires
- Refresh token have more lifetime that access token - 7 days, for example
*/

export class CreateRefreshTokenProvider {

    async execute(userId: number) {

        const expiresIn = dayjs().add(7, "days").unix();

        const new_refresh_token = await prisma.refreshToken.upsert({
            where: {
                userId: userId
            },
            update: {
                expiresIn: expiresIn
            },
            create: {
                userId: userId,
                expiresIn
            }
        });

        const refresh_token_jwt = sign({}, process.env.SECRET_JWT, {
            subject: new_refresh_token.id,
            expiresIn: "7d"
        });

        return refresh_token_jwt;
    }

}