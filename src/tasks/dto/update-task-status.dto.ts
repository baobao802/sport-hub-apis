import { IsEnum } from 'class-validator';

import { TaskStatus } from '../enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
