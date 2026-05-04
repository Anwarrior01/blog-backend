import { CreateUserDTO } from '@/user/dto/createUser.dto';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, verify } from "jsonwebtoken"
@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }
    async createUser(createUserDTO: CreateUserDTO): Promise<IUserResponse> {
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDTO);
        const savedUser = await this.userRepository.save(newUser);
        return this.generateUserResponse(savedUser);
    }

    generateToken(user: UserEntity): string {
        return sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
        )

    }
    generateUserResponse(user: UserEntity): IUserResponse {
        return {
            user: {
                ...user,
                token: this.generateToken(user)
            }
        }
    }
}
