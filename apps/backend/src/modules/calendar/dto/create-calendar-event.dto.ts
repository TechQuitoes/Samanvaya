import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { CalendarCategory } from '../schemas/calendar-event.schema';

export class CreateCalendarEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(CalendarCategory)
  @IsOptional()
  category?: CalendarCategory;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  moduleType?: string;

  @IsString()
  @IsOptional()
  moduleRefId?: string;

  @IsOptional()
  meta?: Record<string, any>;
}
