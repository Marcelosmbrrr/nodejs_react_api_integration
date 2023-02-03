import { client as prisma } from '../../prisma/client';
// JWT
import { verify } from 'jsonwebtoken';

/*
- This class is used to create an refresh token
- Its used to recreat the access token after it expires
- Refresh token have more lifetime that access token - 7 days, for example
*/

export class VerifyTokenProvider {

    async execute(token: string) {

        const verification = verify(token, process.env.SECRET_JWT, (err, payload) => {
            if (err) {
                return false;
            } else {
                return payload;
            }
        });

        return verification;
    }

}