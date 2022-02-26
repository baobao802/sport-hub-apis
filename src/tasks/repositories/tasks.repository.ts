import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/auth/entities';
import { Pagination } from 'src/common/pagination';
import { CreateTaskDto } from '../dto';
import { GetTasksFilterDto } from '../dto';
import { TaskStatus } from '../enum';
import { Task } from '../entities';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Pagination<Task>> {
    const { status, search, page = 1, size = 10 } = filterDto;

    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const totalItems = await query.getCount();

    query.skip((page - 1) * size).take(size);

    const tasks = await query.getMany();

    const itemCount = tasks.length;
    const itemsPerPage = size;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = page;

    const paginated = {
      items: tasks,
      meta: {
        itemCount,
        totalItems,
        itemsPerPage,
        totalPages,
        currentPage,
      },
    };
    return paginated;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }
}

/*
  {
    items: [],
    meta: {
      totalItems,
      itemCount,
      itemsPerPage,
      totalPages,
      currentPage
    }
  }
*/
