import { prisma } from '@bandi/database';
import { BaseRepository } from '@bandi/core/repository';
import { CreateNotFoundDto, UpdateNotFoundDto } from './NotFound.dto';
import { CaptainNotFound, PrismaClient } from '@prisma/client';

/**
 * Repository for CaptainNotFound entity
 * Handles all data access operations with type-safe Prisma queries
 */
export class NotFoundRepository extends BaseRepository<
  CaptainNotFound,
  CreateNotFoundDto,
  UpdateNotFoundDto
> {
  constructor() {
    super(prisma as PrismaClient);
  }

  async create(data: CreateNotFoundDto): Promise<CaptainNotFound> {
    return this.prisma.captainNotFound.create({ data });
  }

  async findAll(): Promise<CaptainNotFound[]> {
    return this.prisma.captainNotFound.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<CaptainNotFound | null> {
    return this.prisma.captainNotFound.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateNotFoundDto): Promise<CaptainNotFound> {
    return this.prisma.captainNotFound.update({ where: { id }, data });
  }

  async delete(id: string): Promise<CaptainNotFound> {
    return this.prisma.captainNotFound.delete({ where: { id } });
  }
}
