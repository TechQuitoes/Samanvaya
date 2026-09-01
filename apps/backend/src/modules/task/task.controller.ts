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
import { TaskService } from './task.service';
import { TaskModuleType, TaskPriority, TaskStatus } from './schemas/task.schema';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  AddTaskCommentDto,
} from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateTaskDto) {
    return this.taskService.createTask(req.user.userId, dto);
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('moduleType') moduleType?: TaskModuleType,
    @Query('moduleRefId') moduleRefId?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
  ) {
    return this.taskService.findAll(req.user.userId, req.user.role, {
      moduleType,
      moduleRefId,
      assignedTo,
      status,
      priority,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(id, req.user.userId, req.user.role, dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    const userName = req.user.name || req.user.email || 'Devotee';
    return this.taskService.updateStatus(id, req.user.userId, userName, dto);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: AddTaskCommentDto,
  ) {
    const userName = req.user.name || req.user.email || 'Devotee';
    return this.taskService.addComment(id, req.user.userId, userName, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
