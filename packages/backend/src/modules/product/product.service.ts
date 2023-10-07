import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/processors/database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async listProduct() {
    return this.prisma.category.findMany({
      include: {
        products: {
          where: {
            isHidden: false,
          },
        },
      },
    });
  }
}
