import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WardService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.ward.findMany();
  }

  findOne(id: string) {
    return this.prisma.ward.findUnique({ where: { id } });
  }
}
