import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TempleService } from './temple.service';
import { CreateTempleDto } from './dto/create-temple.dto';

@Controller('temples')
export class TempleController {
  constructor(private readonly templeService: TempleService) {}

  @Post()
  async create(@Body() createTempleDto: CreateTempleDto) {
    return this.templeService.create(createTempleDto);
  }

  @Get()
  async findAll() {
    return this.templeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.templeService.findById(id);
  }
}
