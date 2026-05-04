import { CreateUserDTO } from '@/user/dto/createUser.dto';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from "jsonwebtoken"
import {compare} from "bcrypt"
import { LoginUserDTO } from '@/user/dto/loginUser.dto';
@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }
    async createUser(createUserDTO: CreateUserDTO): Promise<IUserResponse> {
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDTO);
        const userByEmail = await this.userRepository.findOne({
            where: {
                email: createUserDTO.email
            }
        })
        const userByUsername = await this.userRepository.findOne({
            where: {
                username: createUserDTO.username
            }
        })
        if (userByEmail || userByUsername) {
            throw new HttpException('User with this email or username already exists', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const savedUser = await this.userRepository.save(newUser);
        return this.generateUserResponse(savedUser);
    }
    async loginUser(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDTO.email
            }
        })
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        const matchedPassword = await compare(loginUserDTO.password, user.password);
         if (!matchedPassword) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        delete user.password;
        return user;
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
