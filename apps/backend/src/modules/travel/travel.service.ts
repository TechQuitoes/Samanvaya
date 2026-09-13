import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { NotificationService } from '../notification/notification.service';
import { NotificationTemplateKey } from '../notification/notification-templates';

@Injectable()
export class TravelService {
  private readonly logger = new Logger(TravelService.name);

  constructor(
    @InjectModel(Travel.name) private readonly travelModel: Model<TravelDocument>,
    @InjectModel(TravelTask.name) private readonly travelTaskModel: Model<TravelTaskDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(
    leaderId: string,
    statusFilter?: TravelStatus,
    userRole?: string,
    categoryFilter?: string,
  ): Promise<TravelDocument[]> {
    const query: any = {};
    const r = (userRole || '').toLowerCase().trim();
    const isElevatedAdmin =
      r === 'super admin' ||
      r === 'super administrator' ||
      r === 'admin' ||
      r === 'administrator' ||
      r === 'travel team' ||
      r === 'super_admin';

    // Non-admin leaders only see their own travels; Admins and Travel Team see all travels
    if (!isElevatedAdmin) {
      query.leaderId = new Types.ObjectId(leaderId);
    }
    if (statusFilter) {
      query.status = statusFilter;
    }
    if (categoryFilter && categoryFilter !== 'ALL') {
      if (categoryFilter === 'GENERAL') {
        query.$or = [
          { category: 'GENERAL' },
          { category: { $exists: false } },
          { category: null },
        ];
      } else {
        query.category = categoryFilter;
      }
    }
    const travels = await this.travelModel
      .find(query)
      .populate('leaderId', 'name email mobile initiatedName spiritualName avatar')
      .populate('approvedBy', 'name email initiatedName avatar')
      .populate('destinationTempleId', 'name city state')
      .sort({ startDate: -1 })
      .exec();

    // Dynamically reconcile and sync status based on dates
    const updateOps: any[] = [];
    for (const travel of travels) {
      if (travel.status !== TravelStatus.CANCELLED) {
        const computed = this.computeEffectiveStatus(travel.startDate, travel.endDate, travel.status);
        if (computed !== travel.status) {
          travel.status = computed;
          updateOps.push({
            updateOne: {
              filter: { _id: travel._id },
              update: { $set: { status: computed } },
            },
          });
        }
      }
    }

    if (updateOps.length > 0) {
      this.travelModel.bulkWrite(updateOps).catch((err) => {
        this.logger.error(`Failed to sync travel statuses: ${err.message}`);
      });
    }

    return travels;
  }

  private computeEffectiveStatus(startDate: Date, endDate: Date, currentStatus: TravelStatus): TravelStatus {
    if (currentStatus === TravelStatus.CANCELLED) return TravelStatus.CANCELLED;
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Yatra remains ongoing throughout its final day
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    if (now > endOfDay) {
      return TravelStatus.COMPLETED;
    }
    if (now >= start && now <= endOfDay) {
      return TravelStatus.ONGOING;
    }
    return TravelStatus.UPCOMING;
  }

  async updateApproval(
    id: string,
    adminId: string,
    approvalStatus: 'APPROVED' | 'REJECTED',
    approvalRemarks?: string,
  ): Promise<TravelDocument> {
    const travel = await this.findById(id);
    travel.approvalStatus = approvalStatus;
    if (approvalRemarks !== undefined) {
      travel.approvalRemarks = approvalRemarks;
    }
    travel.approvedBy = new Types.ObjectId(adminId);
    travel.approvedAt = new Date();

    if (approvalStatus === 'REJECTED') {
      travel.status = TravelStatus.CANCELLED;
    }

    const saved = await travel.save();

    // Dispatch notification to Devotee
    try {
      const devoteeId = (travel.leaderId as any)?._id?.toString() || travel.leaderId?.toString();
      if (devoteeId) {
        const templateKey =
          approvalStatus === 'APPROVED'
            ? NotificationTemplateKey.TRAVEL_PLAN_APPROVED
            : NotificationTemplateKey.TRAVEL_PLAN_REJECTED;

        await this.notificationService.sendFromTemplate(templateKey, {
          recipientId: devoteeId,
          senderId: adminId,
          sendPush: true,
          data: {
            travelId: travel._id.toString(),
            title: travel.title,
            destinationCity: travel.destinationCity,
            devoteeName: (travel.leaderId as any)?.name || 'Devotee',
            remarks: approvalRemarks || '',
          },
        });
        this.logger.log(`🔔 Sent approval notification & Web Push to devotee: ${devoteeId}`);
      }
    } catch (err: any) {
      this.logger.error(`Failed to send travel approval notification: ${err.message}`);
    }

    return saved;
  }

  async findById(id: string): Promise<TravelDocument> {
    const travel = await this.travelModel
      .findById(id)
      .populate('leaderId', 'name email mobile avatar')
      .populate('destinationTempleId', 'name city state')
      .exec();

    if (!travel) {
      throw new NotFoundException(`Travel record with ID ${id} not found.`);
    }

    if (travel.status !== TravelStatus.CANCELLED) {
      const computed = this.computeEffectiveStatus(travel.startDate, travel.endDate, travel.status);
      if (computed !== travel.status) {
        travel.status = computed;
        await this.travelModel.updateOne({ _id: travel._id }, { $set: { status: computed } });
      }
    }

    return travel;
  }

  async create(leaderId: string, createDto: CreateTravelDto): Promise<TravelDocument> {
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);
    const now = new Date();

    let computedStatus = createDto.status;
    if (!computedStatus || computedStatus !== TravelStatus.CANCELLED) {
      computedStatus = this.computeEffectiveStatus(startDate, endDate, TravelStatus.UPCOMING);
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

    const saved = await createdTravel.save();

    // Dispatch notification to Super Admins for review
    try {
      const leader = await this.travelModel.db.model('User').findById(leaderId).exec();
      await this.notificationService.sendFromTemplate(
        NotificationTemplateKey.TRAVEL_PLAN_SUBMITTED,
        {
          senderId: leaderId,
          sendPush: true,
          data: {
            travelId: saved._id.toString(),
            title: saved.title,
            devoteeName: leader?.name || 'A devotee',
            fromLocation: saved.fromLocation,
            destinationCity: saved.destinationCity,
          },
        },
      );
    } catch (err: any) {
      this.logger.error(`Failed to send travel creation notification: ${err.message}`);
    }

    return saved;
  }

  async update(id: string, updateDto: Partial<CreateTravelDto>): Promise<TravelDocument> {
    const travel = await this.findById(id);

    if (updateDto.destinationTempleId) {
      (updateDto as any).destinationTempleId = new Types.ObjectId(updateDto.destinationTempleId);
    }

    if (updateDto.approvalStatus) {
      travel.approvalStatus = updateDto.approvalStatus;
      travel.approvedAt = new Date();
      if (updateDto.approvalStatus === 'REJECTED') {
        travel.status = TravelStatus.CANCELLED;
      }
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
