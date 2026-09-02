import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { AlertService } from "./alert.service";

// Resource group: /alerts (017 API/API.md) — list, mark read, resolve
@Controller("alerts")
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  findAll() {
    return this.alertService.findAll();
  }

  @Patch(":id/read")
  markRead(@Param("id") id: string) {
    return this.alertService.markRead(id);
  }

  @Patch(":id/resolve")
  resolve(@Param("id") id: string) {
    return this.alertService.resolve(id);
  }
}
