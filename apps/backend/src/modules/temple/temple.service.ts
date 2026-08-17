import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Temple, TempleDocument } from './schemas/temple.schema';
import { CreateTempleDto } from './dto/create-temple.dto';

@Injectable()
export class TempleService {
  constructor(
    @InjectModel(Temple.name) private templeModel: Model<TempleDocument>,
  ) {}

  async create(createTempleDto: CreateTempleDto): Promise<Temple> {
    const existing = await this.templeModel.findOne({
      name: { $regex: new RegExp(`^${createTempleDto.name}$`, 'i') },
      location: { $regex: new RegExp(`^${createTempleDto.location}$`, 'i') },
    });

    if (existing) {
      return existing;
    }

    const createdTemple = new this.templeModel(createTempleDto);
    return createdTemple.save();
  }

  async findAll(): Promise<Temple[]> {
    return this.templeModel.find().exec();
  }

  async findById(id: string): Promise<Temple | null> {
    return this.templeModel.findById(id).exec();
  }
}
