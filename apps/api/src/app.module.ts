import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { WardModule } from "./ward/ward.module";
import { BedModule } from "./bed/bed.module";
import { IvModule } from "./iv/iv.module";
import { AlertModule } from "./alert/alert.module";
import { DeviceModule } from "./device/device.module";
import { NotificationModule } from "./notification/notification.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    WardModule,
    BedModule,
    IvModule,
    AlertModule,
    DeviceModule,
    NotificationModule,
    AnalyticsModule,
    SocketModule,
  ],
})
export class AppModule {}
