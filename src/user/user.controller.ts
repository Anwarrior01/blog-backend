import type { AuthRequest } from '@/types/expressRequest.interface';
import { CreateUserDTO } from '@/user/dto/createUser.dto';
import { LoginUserDTO } from '@/user/dto/loginUser.dto';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { UserService } from '@/user/user.service';
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('users')
    @UsePipes(new ValidationPipe)
    async createUser(@Body('user') createUserDTO: CreateUserDTO): Promise<IUserResponse> {
        return await this.userService.createUser(createUserDTO);
    }
    @Post('users/login')
    @UsePipes(new ValidationPipe)
    async loginUser(@Body('user') loginUserDTO: LoginUserDTO): Promise<IUserResponse> {
        const user = await this.userService.loginUser(loginUserDTO);
        return this.userService.generateUserResponse(user);
    }
    @Get('user')
    async getCurrentUser(@Req() request:AuthRequest): Promise<IUserResponse> {
        // console.log("request : " , request)
        return this.userService.generateUserResponse(request.user);
    } 
}
