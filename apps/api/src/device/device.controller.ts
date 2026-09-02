import { Controller, Get, Param } from "@nestjs/common";
import { DeviceService } from "./device.service";

// Resource group: /devices (017 API/API.md) — list/provision/update/delete
@Controller("devices")
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.deviceService.findOne(id);
  }
}
