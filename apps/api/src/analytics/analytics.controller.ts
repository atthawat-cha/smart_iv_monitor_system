import { Controller, Get } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

// Resource group: /analytics (017 API/API.md) — daily-stats, consumption-trend,
// ward-distribution, device-reliability, nurse-workload
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("daily-stats")
  dailyStats() {
    return this.analyticsService.dailyStats();
  }

  @Get("consumption-trend")
  consumptionTrend() {
    return this.analyticsService.consumptionTrend();
  }

  @Get("ward-distribution")
  wardDistribution() {
    return this.analyticsService.wardDistribution();
  }

  @Get("device-reliability")
  deviceReliability() {
    return this.analyticsService.deviceReliability();
  }

  @Get("nurse-workload")
  nurseWorkload() {
    return this.analyticsService.nurseWorkload();
  }
}
