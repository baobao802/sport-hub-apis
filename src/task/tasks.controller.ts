import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { Role } from 'src/permission/enum';
import { Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/auth/guards';
import { User } from 'src/user/entities';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskStatusDto } from './dto';
import { Task } from './entities';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  // @Roles(Role.MODERATOR, Role.ADMIN)
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User) {
    return this.tasksService.findAll(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.findById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createOne(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteOne(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
