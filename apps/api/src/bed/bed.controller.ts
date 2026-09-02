import { Controller, Get, Param } from "@nestjs/common";
import { BedService } from "./bed.service";

// Resource group: /wards/:wardId/beds, /beds/:id (017 API/API.md)
@Controller()
export class BedController {
  constructor(private readonly bedService: BedService) {}

  @Get("wards/:wardId/beds")
  findByWard(@Param("wardId") wardId: string) {
    return this.bedService.findByWard(wardId);
  }

  @Get("beds/:id")
  findOne(@Param("id") id: string) {
    return this.bedService.findOne(id);
  }
}
