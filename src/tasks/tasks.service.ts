import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Pagination } from 'src/common/pagination';
import { User } from 'src/users/entities';
import { GetTasksFilterDto, CreateTaskDto } from './dto';
import { TasksRepository } from './repositories';
import { TaskStatus } from './enum';
import { Task } from './entities';
import { ILike } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Pagination<Task>> {
    const { status, search = '', page = 1, size = 10 } = filterDto;
    const [tasks, count] = await this.tasksRepository.findAndCount({
      where: [
        { status },
        { status, title: ILike(`%${search}%`) },
        { status, description: ILike(`%${search}%`) },
      ],
      skip: (page - 1) * size,
      take: size,
    });

    const totalItems = count;
    const itemCount = tasks.length;
    const itemsPerPage = size;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = page;

    return {
      items: tasks,
      meta: {
        itemCount,
        totalItems,
        itemsPerPage,
        totalPages,
        currentPage,
      },
    };
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return found;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.debug('Called every 10 minutes');
  }
}
