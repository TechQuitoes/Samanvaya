import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Travel, TravelDocument, TravelStatus } from './schemas/travel.schema';
import { TravelTask, TravelTaskDocument } from './schemas/travel-task.schema';
import {
  CreateTravelDto,
  CreateTravelTaskDto,
  ExpenseDto,
  UpdateTravelTaskDto,
} from './dto/create-travel.dto';

@Injectable()
export class TravelService {
  constructor(
    @InjectModel(Travel.name) private readonly travelModel: Model<TravelDocument>,
    @InjectModel(TravelTask.name) private readonly travelTaskModel: Model<TravelTaskDocument>,
  ) {}

  async findAll(leaderId: string, statusFilter?: TravelStatus): Promise<TravelDocument[]> {
    const query: any = { leaderId: new Types.ObjectId(leaderId) };
    if (statusFilter) {
      query.status = statusFilter;
    }
    return this.travelModel
      .find(query)
      .populate('destinationTempleId', 'name city state')
      .sort({ startDate: -1 })
      .exec();
  }

  async findById(id: string): Promise<TravelDocument> {
    const travel = await this.travelModel
      .findById(id)
      .populate('leaderId', 'name email mobile')
      .populate('destinationTempleId', 'name city state')
      .exec();

    if (!travel) {
      throw new NotFoundException(`Travel record with ID ${id} not found.`);
    }

    return travel;
  }

  async create(leaderId: string, createDto: CreateTravelDto): Promise<TravelDocument> {
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);
    const now = new Date();

    // Auto-detect status if not explicitly passed
    let computedStatus = createDto.status || TravelStatus.UPCOMING;
    if (!createDto.status) {
      if (endDate < now) {
        computedStatus = TravelStatus.COMPLETED;
      } else if (startDate <= now && endDate >= now) {
        computedStatus = TravelStatus.ONGOING;
      }
    }

    const isBackdated = createDto.isBackdated ?? (endDate < now);

    const createdTravel = new this.travelModel({
      ...createDto,
      leaderId: new Types.ObjectId(leaderId),
      destinationTempleId: createDto.destinationTempleId
        ? new Types.ObjectId(createDto.destinationTempleId)
        : undefined,
      startDate,
      endDate,
      status: computedStatus,
      isBackdated,
    });

    return createdTravel.save();
  }

  async update(id: string, updateDto: Partial<CreateTravelDto>): Promise<TravelDocument> {
    const travel = await this.findById(id);

    if (updateDto.destinationTempleId) {
      (updateDto as any).destinationTempleId = new Types.ObjectId(updateDto.destinationTempleId);
    }

    Object.assign(travel, updateDto);

    if (updateDto.startDate) travel.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) travel.endDate = new Date(updateDto.endDate);

    return travel.save();
  }

  async addExpense(id: string, expenseDto: ExpenseDto): Promise<TravelDocument> {
    const travel = await this.findById(id);
    travel.expenses.push({
      title: expenseDto.title,
      category: expenseDto.category || 'MISC',
      amount: expenseDto.amount,
      currency: expenseDto.currency || 'INR',
      receiptUrl: expenseDto.receiptUrl,
      paymentMethod: expenseDto.paymentMethod || 'CASH',
      createdAt: new Date(),
    });
    return travel.save();
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.travelModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Travel record with ID ${id} not found.`);
    }
    return { success: true };
  }

  // --- Travel Tasks Methods ---

  async findTasksForTravel(travelId: string): Promise<TravelTaskDocument[]> {
    return this.travelTaskModel
      .find({ travelId: new Types.ObjectId(travelId) })
      .populate('assigneeId', 'name email mobile')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createTask(
    travelId: string,
    leaderId: string,
    createTaskDto: CreateTravelTaskDto,
  ): Promise<TravelTaskDocument> {
    await this.findById(travelId); // Ensure travel exists

    const newTask = new this.travelTaskModel({
      travelId: new Types.ObjectId(travelId),
      leaderId: new Types.ObjectId(leaderId),
      title: createTaskDto.title,
      description: createTaskDto.description || '',
      assigneeId: createTaskDto.assigneeId
        ? new Types.ObjectId(createTaskDto.assigneeId)
        : undefined,
      priority: createTaskDto.priority,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
    });

    return (await newTask.save()).populate('assigneeId', 'name email mobile');
  }

  async updateTask(
    taskId: string,
    userId: string,
    userName: string,
    updateTaskDto: UpdateTravelTaskDto,
  ): Promise<TravelTaskDocument> {
    const task = await this.travelTaskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException(`Travel task with ID ${taskId} not found.`);
    }

    if (updateTaskDto.status) {
      task.status = updateTaskDto.status;
    }

    if (updateTaskDto.commentText) {
      task.comments.push({
        authorId: new Types.ObjectId(userId),
        authorName: userName,
        commentText: updateTaskDto.commentText,
        createdAt: new Date(),
      });
    }

    return (await task.save()).populate('assigneeId', 'name email mobile');
  }
}
