import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

// Resource group: /auth (017 API/API.md) — login, logout, me
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post("logout")
  logout() {
    return this.authService.logout();
  }

  @Get("me")
  me() {
    return this.authService.me();
  }
}
