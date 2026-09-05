import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @UseGuards(JwtAuthGuard)
  @Get('month')
  async getMonthEvents(
    @Request() req: any,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const userId = req.user.userId || req.user.sub || req.user.id || 'anonymous';
    const currentYear = year ? parseInt(year, 10) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month, 10) : new Date().getMonth() + 1;

    return this.calendarService.getMonthEvents(userId, currentYear, currentMonth);
  }

  @UseGuards(JwtAuthGuard)
  @Get('day')
  async getDaySchedule(
    @Request() req: any,
    @Query('date') date?: string,
  ) {
    const userId = req.user.userId || req.user.sub || req.user.id || 'anonymous';
    const targetDate = date || new Date().toISOString().slice(0, 10);

    return this.calendarService.getDaySchedule(userId, targetDate);
  }

  @UseGuards(JwtAuthGuard)
  @Post('events')
  async createEvent(
    @Request() req: any,
    @Body() dto: CreateCalendarEventDto,
  ) {
    const userId = req.user.userId || req.user.sub || req.user.id || 'anonymous';
    return this.calendarService.createEvent(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('events/:id')
  async deleteEvent(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const userId = req.user.userId || req.user.sub || req.user.id || 'anonymous';
    return this.calendarService.deleteEvent(userId, id);
  }
}
