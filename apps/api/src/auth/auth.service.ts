import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  async login(email: string, password: string) {
    throw new Error("not implemented");
  }

  async logout() {
    throw new Error("not implemented");
  }

  async me() {
    throw new Error("not implemented");
  }
}
