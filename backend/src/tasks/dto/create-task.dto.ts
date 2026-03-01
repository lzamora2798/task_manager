import { IsEnum, IsOptional, IsString, MaxLength, MinLength, IsDateString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  // Debe ser ISO, pero lo guardaremos como YYYY-MM-DD
  @IsOptional()
  @IsDateString()
  due_date?: string;
}