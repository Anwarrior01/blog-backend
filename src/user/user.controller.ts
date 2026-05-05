import type { AuthRequest } from '@/types/expressRequest.interface';
import { User } from '@/user/decorators/user.decorator';
import { CreateUserDTO } from '@/user/dto/createUser.dto';
import { LoginUserDTO } from '@/user/dto/loginUser.dto';
import { AuthGuard } from '@/user/guards/auth.guard';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { UserService } from '@/user/user.service';
import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

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
    @UseGuards(AuthGuard)
    @Get('user')
    async getCurrentUser(@User() user): Promise<IUserResponse> {
        return this.userService.generateUserResponse(user);
    } 
}
