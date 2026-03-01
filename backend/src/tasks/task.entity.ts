import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
  }
  
  export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
  }
  
  @Entity()
  export class Task {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;
  
    // ✅ explicit type (fixes your error)
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Index()
    @Column({
      type: 'enum',
      enum: TaskStatus,
      default: TaskStatus.PENDING,
    })
    status: TaskStatus;
  
    @Column({
      type: 'enum',
      enum: TaskPriority,
      default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;
  
    // If you only need date (no time), keep as 'date'
    @Column({ type: 'date', nullable: true })
    due_date?: string;
  
    @Index()
    @Column({ type: 'int' })
    owner_id: number;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
  }