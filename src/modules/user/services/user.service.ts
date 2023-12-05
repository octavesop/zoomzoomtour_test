import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AlreadyExistUserException } from 'src/exceptions/alreadyExistUser.exception';
import { NotExistUserException } from 'src/exceptions/notExistUser.exception';
import { Repository } from 'typeorm';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async #bcryptHash(password: string): Promise<string> {
    const saltOrRounds = 8;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async #isHashMatch(value: string, hashedValue): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue);
  }

  async signUp(request: SignUpRequest): Promise<User> {
    try {
      const isIdExist = await this.userRepository.findOne({
        where: {
          userId: request.userId,
        },
      });

      if (isIdExist) {
        throw new AlreadyExistUserException(request.userId);
      }

      return await this.userRepository.save({
        ...request,
        userPw: await this.#bcryptHash(request.userPw),
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async signIn(request: SignInRequest): Promise<User> {
    try {
      const userInfo = await this.userRepository.findOne({
        where: {
          userId: request.userId,
        },
      });

      if (!userInfo) {
        throw new NotExistUserException();
      }

      if (!(await this.#isHashMatch(request.userPw, userInfo.userPw))) {
        throw new NotExistUserException();
      }

      return userInfo;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
