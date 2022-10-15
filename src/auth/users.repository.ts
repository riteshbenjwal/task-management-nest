import { AuthCredentialsDto } from './dto/auth_credentials.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {

    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username,password:  hashedPassword });
  try{
    await this.save(user);
  }catch(err){
    if(err.code === '23505'){
      throw new ConflictException('Username already exists');
    }else{
        throw new InternalServerErrorException();
    }
  }
  }
}
