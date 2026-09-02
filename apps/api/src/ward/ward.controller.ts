import { Controller, Get, Param } from "@nestjs/common";
import { WardService } from "./ward.service";

// Resource group: /wards (017 API/API.md) — CRUD + aggregate bed-status counts
@Controller("wards")
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get()
  findAll() {
    return this.wardService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.wardService.findOne(id);
  }
}
