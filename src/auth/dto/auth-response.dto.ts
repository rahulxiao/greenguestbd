export class AuthResponseDto {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}

export class LoginResponseDto {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

export class RegisterResponseDto {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
} 