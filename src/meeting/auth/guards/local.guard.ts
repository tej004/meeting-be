import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GUARDS } from '../constants/guards/guard.constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard(GUARDS.LOCAL) {}
