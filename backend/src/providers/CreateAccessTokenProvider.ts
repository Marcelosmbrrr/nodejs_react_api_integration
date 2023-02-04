// JWT
import { sign } from 'jsonwebtoken';

/*
- This class is used to create an access token 
- Its used to access protected routes and preserve login state
- It have a tiny lifetime - 1 hour, for example
*/

export class CreateAccessTokenProvider {

    async execute(userId: number) {

        const access_token_jwt = sign({}, process.env.SECRET_JWT, {
            subject: userId.toString(),
            expiresIn: "1000s"
        });

        return access_token_jwt;
    }

}