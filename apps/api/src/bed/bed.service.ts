import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BedService {
  constructor(private readonly prisma: PrismaService) {}

  findByWard(wardId: string) {
    return this.prisma.bed.findMany({ where: { wardId } });
  }

  findOne(id: string) {
    return this.prisma.bed.findUnique({ where: { id }, include: { ivStatus: true } });
  }
}
