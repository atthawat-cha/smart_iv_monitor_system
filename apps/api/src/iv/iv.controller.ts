import { Controller, Get } from "@nestjs/common";
import { IvService } from "./iv.service";

// Resource group: /iv-status, /priority-queue (017 API/API.md)
@Controller()
export class IvController {
  constructor(private readonly ivService: IvService) {}

  @Get("iv-status")
  findAll() {
    return this.ivService.findAllStatus();
  }

  @Get("priority-queue")
  priorityQueue() {
    return this.ivService.getPriorityQueue();
  }
}
