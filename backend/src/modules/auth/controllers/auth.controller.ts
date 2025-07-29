import { Body, Controller, Post } from '@nestjs/common';
import type { LoginRequest, LoginResponse } from '../../../types';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: Implement authentication endpoints
  // This is a placeholder implementation for task 0.1.b

  @Post('login')
  async login(@Body() credentials: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(credentials);
  }
}
