import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserDocument, User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<IUserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token: string | undefined = req.get('Authorization');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const user: IUserDocument | null = await this.userModel.findOne({ token });
    if (!user) {
      throw new UnauthorizedException('invalid token provided');
    }

    req.user = user;
    return true;
  }
}
