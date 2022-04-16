import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Pagination } from 'src/common/types';
import { User } from 'src/users/entities';
import { GetTasksFilterDto, CreateTaskDto } from './dto';
import { TaskStatus } from './enum';
import { Task } from './entities';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findTasks(filterDto: GetTasksFilterDto): Promise<Pagination<Task>> {
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
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    return this.tasksRepository.save(task);
  }

  async findTaskById(id: string, user: User): Promise<Task> {
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
    const task = await this.findTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.debug('Called every 10 minutes');
  }
}
