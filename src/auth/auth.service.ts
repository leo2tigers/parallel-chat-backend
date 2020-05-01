import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new UnauthorizedException(`Invalid username`);
        }
        if (await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user._id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
            id: user._id,
            username: user.username,
        };
    }
}
