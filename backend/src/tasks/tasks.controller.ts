import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { TasksService } from './tasks.service';
  import { CreateTaskDto } from './dto/create-task.dto';
  import { UpdateTaskDto } from './dto/update-task.dto';
  import { TaskStatus } from './task.entity';
  
  @Controller('tasks')
  @UseGuards(JwtAuthGuard)
  export class TasksController {
    constructor(private readonly tasks: TasksService) {}
  
    @Get()
    async list(
      @Request() req,
      @Query('status') status?: TaskStatus,
    ) {
      return this.tasks.list(req.user.userId, status);
    }
  
    // POST /tasks
    @Post()
    async create(
      @Request() req,
      @Body() dto: CreateTaskDto,
    ) {
      return this.tasks.create(req.user.userId, dto);
    }
  
    // PUT /tasks/:id
    @Put(':id')
    async update(
      @Request() req,
      @Param('id') id: string,
      @Body() dto: UpdateTaskDto,
    ) {
      return this.tasks.update(req.user.userId, Number(id), dto);
    }
  
    // DELETE /tasks/:id
    @Delete(':id')
    async remove(
      @Request() req,
      @Param('id') id: string,
    ) {
      return this.tasks.remove(req.user.userId, Number(id));
    }
  }