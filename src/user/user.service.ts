import { CreateUserDTO } from '@/user/dto/createUser.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
   createUser(createUserDTO:CreateUserDTO):CreateUserDTO{
    return createUserDTO
}
}
