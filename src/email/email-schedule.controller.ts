import { Body, Controller, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/permission/enum';
import { EmailScheduleDto } from './dto';
import { EmailScheduleService } from './email-schedule.service';

@Controller('email-scheduling')
@UseGuards(JwtAuthGuard, RolesGuard)
export default class EmailScheduleController {
  constructor(private emailScheduleService: EmailScheduleService) {}

  @Post('schedule')
  @Roles(Role.MODERATOR, Role.ADMIN)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailScheduleService.scheduleEmail(emailSchedule);
  }
}
