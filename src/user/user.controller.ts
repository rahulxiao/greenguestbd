import { 
  Body, 
  Controller, 
  Delete, 
  Param, 
  Post, 
  Query, 
  Get, 
  Put, 
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  LoginUserDto,
  UserResponseDto,
  UserProfileDto
} from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('createUser')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.createUser(createUserDto);
  }

  @Get('getAllUsers')
  async getAllUsers(): Promise<UserResponseDto[]> {
    return await this.userService.getAllUsers();
  }

  @Get('getUserById/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return await this.userService.getUserById(id);
  }

  @Get('getUserProfile/:id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number): Promise<UserProfileDto> {
    return await this.userService.getUserProfile(id);
  }

  @Put('updateUser/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Put('updateUserProfile/:id')
  async updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UserProfileDto> {
    return await this.userService.updateUserProfile(id, updateProfileDto);
  }

  @Post('loginUser')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<{ user: UserResponseDto; message: string }> {
    const user = await this.userService.findUserByEmail(loginUserDto.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In a real app, you'd verify the password here
    // const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    // if (!isPasswordValid) {
    //   throw new Error('Invalid credentials');
    // }

    return {
      user: this.userService['mapToResponseDto'](user),
      message: 'Login successful'
    };
  }

  @Delete('deleteUserById/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
    const success = await this.userService.deleteUser(id);
    return {
      success,
      message: success ? 'User deleted successfully' : 'Failed to delete user'
    };
  }

  @Get('getUserByEmail')
  async getUserByEmail(@Query('email') email: string): Promise<UserResponseDto | null> {
    const user = await this.userService.findUserByEmail(email);
    return user ? this.userService['mapToResponseDto'](user) : null;
  }

  @Get('getUsersByName')
  async getUsersByName(@Query('name') name: string): Promise<UserResponseDto[]> {
    return await this.userService.getUsersByName(name);
  }
}
