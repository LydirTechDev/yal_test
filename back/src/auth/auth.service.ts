import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/resources/users/entities/user.entity';
import { UsersService } from 'src/resources/users/users.service';
import { LoginAuthDto } from './login/dto/login.auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(authLoginDto: LoginAuthDto): Promise<User> {
        const user = await this.usersService.findOneByEmail(authLoginDto.email);
        if (!user || !(await bcrypt.compare(authLoginDto.password, user.password))) {
            throw new UnauthorizedException();
        }
        delete user.password;
        return user;
    }

    async login(user: any) {
        const payload = { id: user.id, email: user.email, typeUser: user.typeUser };
        payload.typeUser = payload.typeUser.toString()
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
