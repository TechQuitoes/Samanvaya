import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelStatus } from './schemas/travel.schema';
import {
  CreateTravelDto,
  CreateTravelTaskDto,
  ExpenseDto,
  UpdateTravelTaskDto,
} from './dto/create-travel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('travel')
@UseGuards(JwtAuthGuard)
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Get()
  async findAll(@Request() req: any, @Query('status') status?: TravelStatus) {
    return this.travelService.findAll(req.user.userId, status);
  }

  @Post()
  async create(@Request() req: any, @Body() createDto: CreateTravelDto) {
    return this.travelService.create(req.user.userId, createDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.travelService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<CreateTravelDto>) {
    return this.travelService.update(id, updateDto);
  }

  @Post(':id/expenses')
  async addExpense(@Param('id') id: string, @Body() expenseDto: ExpenseDto) {
    return this.travelService.addExpense(id, expenseDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.travelService.delete(id);
  }

  // --- Travel Tasks Endpoints ---

  @Get(':id/tasks')
  async getTasks(@Param('id') id: string) {
    return this.travelService.findTasksForTravel(id);
  }

  @Post(':id/tasks')
  async createTask(
    @Param('id') id: string,
    @Request() req: any,
    @Body() createTaskDto: CreateTravelTaskDto,
  ) {
    return this.travelService.createTask(id, req.user.userId, createTaskDto);
  }

  @Patch('tasks/:taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Request() req: any,
    @Body() updateTaskDto: UpdateTravelTaskDto,
  ) {
    const userName = req.user.name || 'Leader';
    return this.travelService.updateTask(taskId, req.user.userId, userName, updateTaskDto);
  }
}
