import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

  async list(ownerId: number, status?: TaskStatus) {
    const where: any = { owner_id: ownerId };
    if (status) where.status = status;
    return this.repo.find({
      where,
      order: { updated_at: 'DESC' },
    });
  }

  async create(ownerId: number, dto: CreateTaskDto) {
    const task = this.repo.create({
      ...dto,
      owner_id: ownerId,
      due_date: dto.due_date ? dto.due_date.slice(0, 10) : undefined, // YYYY-MM-DD
    });
    return this.repo.save(task);
  }

  async update(ownerId: number, id: number, dto: UpdateTaskDto) {
    const task = await this.repo.findOne({ where: { id, owner_id: ownerId } });
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, {
      ...dto,
      due_date: dto.due_date ? dto.due_date.slice(0, 10) : task.due_date,
    });

    return this.repo.save(task);
  }

  async remove(ownerId: number, id: number) {
    const task = await this.repo.findOne({ where: { id, owner_id: ownerId } });
    if (!task) throw new NotFoundException('Task not found');
    await this.repo.remove(task);
    return { ok: true };
  }
}