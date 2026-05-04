import { CreateUserDTO } from '@/user/dto/createUser.dto';
import { UserEntity } from '@/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}
   async createUser(createUserDTO:CreateUserDTO):Promise<CreateUserDTO>{
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDTO);
    await this.userRepository.save(newUser);
    return createUserDTO;
    }
}
