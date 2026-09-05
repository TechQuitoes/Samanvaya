import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CalendarEvent, CalendarEventDocument, CalendarCategory } from './schemas/calendar-event.schema';
import { Travel, TravelDocument } from '../travel/schemas/travel.schema';
import { Task, TaskDocument } from '../task/schemas/task.schema';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';


@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    @InjectModel(CalendarEvent.name)
    private calendarEventModel: Model<CalendarEventDocument>,
    @InjectModel(Travel.name)
    private travelModel: Model<TravelDocument>,
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  /**
   * Aggregates month calendar summary strictly across real Travels, Tasks, and Events in DB
   */
  async getMonthEvents(userId: string, year: number, month: number) {
    // month is 1-indexed (1 = Jan, 12 = Dec)
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    // 1. Fetch real travel records overlapping this month
    const travels = await this.travelModel
      .find({
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      })
      .lean();

    // 2. Fetch real tasks due in this month
    const tasks = await this.taskModel
      .find({
        dueDate: { $gte: startDate, $lte: endDate },
      })
      .lean();

    // 3. Fetch custom events
    const customEvents = await this.calendarEventModel
      .find({
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      })
      .lean();

    // Map day dates (1 to total days in month)
    const totalDays = endDate.getUTCDate();
    const daysSummary: Record<string, { dateStr: string; hasTravel: boolean; travelCount: number; taskCount: number; eventCount: number; categories: string[] }> = {};

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      const dayTravels = travels.filter((t) => {
        const tStart = new Date(t.startDate).toISOString().slice(0, 10);
        const tEnd = new Date(t.endDate).toISOString().slice(0, 10);
        return dateStr >= tStart && dateStr <= tEnd;
      });

      const dayTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate).toISOString().slice(0, 10) === dateStr;
      });

      const dayEvents = customEvents.filter((e) => {
        const eStart = new Date(e.startDate).toISOString().slice(0, 10);
        const eEnd = new Date(e.endDate).toISOString().slice(0, 10);
        return dateStr >= eStart && dateStr <= eEnd;
      });

      const categories: string[] = [];
      if (dayTravels.length > 0) categories.push('TRAVEL');
      if (dayTasks.length > 0) categories.push('TASK');
      if (dayEvents.some((e) => e.category === CalendarCategory.MEETING)) categories.push('MEETING');

      daysSummary[dateStr] = {
        dateStr,
        hasTravel: dayTravels.length > 0,
        travelCount: dayTravels.length,
        taskCount: dayTasks.length,
        eventCount: dayTravels.length + dayTasks.length + dayEvents.length,
        categories,
      };
    }

    return {
      year,
      month,
      daysSummary,
      activeTravels: travels,
      tasks,
    };
  }

  /**
   * Returns raw DB records for a given day — NO invented/fabricated timeline.
   * Frontend renders travel cards, task cards, etc. directly from this raw data.
   */
  async getDaySchedule(userId: string, dateStr: string) {
    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    // 1. Fetch Real Travels active on this date
    const travels = await this.travelModel
      .find({
        startDate: { $lte: dayEnd },
        endDate: { $gte: dayStart },
      })
      .lean();

    // 2. Fetch Real Tasks due on this date
    const tasks = await this.taskModel
      .find({
        dueDate: { $gte: dayStart, $lte: dayEnd },
      })
      .populate('assignedTo', 'name email avatar')
      .lean();

    // 3. Fetch Custom Calendar Events on this date (if any)
    const customEvents = await this.calendarEventModel
      .find({
        startDate: { $lte: dayEnd },
        endDate: { $gte: dayStart },
      })
      .lean();

    // Return raw DB records only — zero fabrication
    return {
      dateStr,
      travels,
      tasks,
      customEvents,
    };
  }

  async createEvent(userId: string, dto: CreateCalendarEventDto) {
    const event = new this.calendarEventModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return event.save();
  }

  async deleteEvent(userId: string, eventId: string) {
    const event = await this.calendarEventModel.findOneAndDelete({
      _id: new Types.ObjectId(eventId),
    });
    if (!event) {
      throw new NotFoundException('Calendar event not found');
    }
    return { success: true, message: 'Event deleted successfully' };
  }
}

