import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserDocument, User } from '../schemas/user.schema';
import { RegisterUserDto } from './register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<IUserDocument>) {}

  @Post()
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto.email);
    const user: IUserDocument = new this.userModel({
      email: registerUserDto.email,
      password: registerUserDto.password,
      displayName: registerUserDto.displayName,
      role: 'user',
    });

    user.generateToken();
    return await user.save()
  }


  @UseGuards(AuthGuard('local'))
  @Post('session')
  login(@Req() req: Request<{ user: User }>) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Delete('session')
  async logOut(@Req() req: Request<{ user: User }>) {

    const user = await this.userModel.findOne(req.user);
    if (user) {
      user.generateToken();
      user.save();
      return { message: 'User logged out successfully', user };
    }
  }
}
