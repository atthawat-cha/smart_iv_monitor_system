import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

// MVP device auth: static x-device-key header (016 IoT/IoT.md).
// Roadmap: upgrade to JWT Device Token + certificate auth in production (System Architecture.md §5).
@Injectable()
export class DeviceKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.headers["x-device-key"];
    if (!key || key !== process.env.DEVICE_API_KEY) {
      throw new UnauthorizedException("Invalid device key");
    }
    return true;
  }
}
