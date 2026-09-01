import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskModuleType, TaskPriority, TaskStatus } from './schemas/task.schema';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  AddTaskCommentDto,
} from './dto/create-task.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationTemplateKey } from '../notification/notification-templates';
import { User, UserDocument, UserRole } from '../user/schemas/user.schema';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Create a new task and notify the assigned leader/sevak
   */
  async createTask(assignedById: string, dto: CreateTaskDto): Promise<TaskDocument> {
    const createdTask = new this.taskModel({
      ...dto,
      assignedBy: new Types.ObjectId(assignedById),
      assignedTo: new Types.ObjectId(dto.assignedTo),
      moduleRefId: dto.moduleRefId ? new Types.ObjectId(dto.moduleRefId) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      status: dto.status || TaskStatus.PENDING,
      priority: dto.priority || TaskPriority.MEDIUM,
      moduleType: dto.moduleType || TaskModuleType.GENERAL,
    });

    const savedTask = await createdTask.save();

    // Dispatch notification to assigned leader / sevak
    try {
      const assignee = await this.userModel.findById(dto.assignedTo).exec();
      if (assignee) {
        await this.notificationService.sendFromTemplate(NotificationTemplateKey.TASK_ASSIGNED, {
          recipientId: dto.assignedTo,
          senderId: assignedById,
          data: {
            taskId: savedTask._id.toString(),
            title: savedTask.title,
            assigneeName: assignee.name || 'Devotee',
            moduleTitle: savedTask.moduleTitle || '',
            dueDate: savedTask.dueDate
              ? new Date(savedTask.dueDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '',
          },
        });
      }
    } catch (err: any) {
      this.logger.error(`Failed to send task assignment notification: ${err.message}`);
    }

    return this.findById(savedTask._id.toString());
  }

  /**
   * Find all tasks with flexible cross-module and role filters
   */
  async findAll(
    userId: string,
    userRole: string,
    filters?: {
      moduleType?: TaskModuleType;
      moduleRefId?: string;
      assignedTo?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
    },
  ): Promise<TaskDocument[]> {
    const query: any = {};

    // Role-based visibility
    const isElevatedAdmin =
      userRole === UserRole.SUPER_ADMIN ||
      userRole === UserRole.SUPER_ADMINISTRATOR ||
      userRole === UserRole.ADMIN ||
      userRole === UserRole.ADMINISTRATOR ||
      userRole === 'Super Admin' ||
      userRole === 'Admin';

    if (!isElevatedAdmin) {
      // Leaders / Sevaks see tasks assigned to them OR tasks created by them
      query.$or = [
        { assignedTo: new Types.ObjectId(userId) },
        { assignedBy: new Types.ObjectId(userId) },
      ];
    } else if (filters?.assignedTo) {
      query.assignedTo = new Types.ObjectId(filters.assignedTo);
    }

    if (filters?.moduleType) {
      query.moduleType = filters.moduleType;
    }

    if (filters?.moduleRefId) {
      query.moduleRefId = new Types.ObjectId(filters.moduleRefId);
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.priority) {
      query.priority = filters.priority;
    }

    return this.taskModel
      .find(query)
      .populate('assignedTo', 'name email mobile spiritualName initiatedName avatar')
      .populate('assignedBy', 'name email mobile spiritualName initiatedName')
      .populate('comments.author', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Find single task by ID
   */
  async findById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findById(id)
      .populate('assignedTo', 'name email mobile spiritualName initiatedName avatar')
      .populate('assignedBy', 'name email mobile spiritualName initiatedName')
      .populate('comments.author', 'name email avatar')
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    return task;
  }

  /**
   * Update task details (title, description, priority, dueDate, assignee)
   */
  async updateTask(
    id: string,
    userId: string,
    userRole: string,
    dto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    const task = await this.findById(id);

    if (dto.assignedTo) {
      (dto as any).assignedTo = new Types.ObjectId(dto.assignedTo);
    }
    if (dto.dueDate) {
      (dto as any).dueDate = new Date(dto.dueDate);
    }

    Object.assign(task, dto);
    await task.save();

    return this.findById(id);
  }

  /**
   * Quick status transition (Pending -> In Progress -> Completed)
   */
  async updateStatus(
    id: string,
    userId: string,
    userName: string,
    dto: UpdateTaskStatusDto,
  ): Promise<TaskDocument> {
    const task = await this.findById(id);

    task.status = dto.status;
    if (dto.status === TaskStatus.COMPLETED) {
      task.completedAt = new Date();
    }

    // Optional status comment
    if (dto.commentText?.trim()) {
      task.comments.push({
        author: new Types.ObjectId(userId) as any,
        authorName: userName,
        commentText: dto.commentText.trim(),
        createdAt: new Date(),
      });
    }

    await task.save();

    // If completed, notify task creator / admin
    if (dto.status === TaskStatus.COMPLETED) {
      try {
        const creatorId = (task.assignedBy as any)?._id?.toString() || task.assignedBy?.toString();
        const assignee = await this.userModel.findById(userId).exec();

        if (creatorId && creatorId !== userId) {
          await this.notificationService.sendFromTemplate(NotificationTemplateKey.TASK_COMPLETED, {
            recipientId: creatorId,
            senderId: userId,
            data: {
              taskId: task._id.toString(),
              title: task.title,
              assigneeName: assignee?.name || userName || 'Devotee',
              moduleTitle: task.moduleTitle || '',
            },
          });
        }
      } catch (err: any) {
        this.logger.error(`Failed to send task completion notification: ${err.message}`);
      }
    }

    return this.findById(id);
  }

  /**
   * Add a comment to a task
   */
  async addComment(
    id: string,
    authorId: string,
    authorName: string,
    dto: AddTaskCommentDto,
  ): Promise<TaskDocument> {
    const task = await this.findById(id);

    task.comments.push({
      author: new Types.ObjectId(authorId) as any,
      authorName,
      commentText: dto.commentText.trim(),
      createdAt: new Date(),
    });

    await task.save();

    // Notify the other party
    try {
      const assignedToId = (task.assignedTo as any)?._id?.toString() || task.assignedTo?.toString();
      const assignedById = (task.assignedBy as any)?._id?.toString() || task.assignedBy?.toString();

      const recipientId = authorId === assignedToId ? assignedById : assignedToId;

      if (recipientId && recipientId !== authorId) {
        await this.notificationService.sendFromTemplate(NotificationTemplateKey.TASK_COMMENT_ADDED, {
          recipientId,
          senderId: authorId,
          data: {
            taskId: task._id.toString(),
            title: task.title,
            authorName,
            commentText: dto.commentText.trim(),
          },
        });
      }
    } catch (err: any) {
      this.logger.error(`Failed to send task comment notification: ${err.message}`);
    }

    return this.findById(id);
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    const res = await this.taskModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return { success: true, message: 'Task deleted successfully.' };
  }
}
