import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { TelemetryController } from "./telemetry.controller";
import { IvModule } from "../iv/iv.module";
import { AlertModule } from "../alert/alert.module";

@Module({
  imports: [IvModule, AlertModule],
  controllers: [DeviceController, TelemetryController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
