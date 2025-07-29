import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '../dto';
import { UserEntity } from '../entities';
import { AuthService } from '../services/auth.service';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserEntity,
  })
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: '#/components/schemas/UserEntity' },
        token: { type: 'string' },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto
  ): Promise<{ user: UserEntity; token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserEntity,
  })
  async getProfile(@Request() req: AuthenticatedRequest): Promise<UserEntity> {
    return this.authService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserEntity,
  })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateData: Partial<UserEntity>
  ): Promise<UserEntity> {
    return this.authService.updateProfile(req.user.id, updateData);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string
  ): Promise<{ token: string }> {
    return this.authService.refreshToken(refreshToken);
  }
}
