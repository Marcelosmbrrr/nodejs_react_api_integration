import { JwtPayload } from 'jsonwebtoken';
import { client as prisma } from '../../prisma/client';

export class VerifyTokenExpirationProvider {

    async execute(tokenPayload: JwtPayload) {

        if (tokenPayload.exp < Date.now()) {
            return true;
        } else {
            return false;
        }
    }

}