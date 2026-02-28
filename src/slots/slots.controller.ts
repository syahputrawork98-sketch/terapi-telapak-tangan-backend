import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { success } from '../common/utils/envelope';
import { ROLES } from '../users/roles';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { SlotsService } from './slots.service';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

@Controller()
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('slots')
  list(@Query('date') date?: string, @Query('status') status?: string) {
    const items = this.slotsService.list({ date, status });
    return success('Slots fetched', { items });
  }

  @Post('admin/slots')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  create(@Body() body: CreateSlotDto, @Req() req: RequestWithUser) {
    const slot = this.slotsService.create(body, req.user!.id);
    return success('Slot created', slot);
  }

  @Patch('admin/slots/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() body: UpdateSlotDto) {
    const slot = this.slotsService.update(id, body);
    return success('Slot updated', slot);
  }

  @Delete('admin/slots/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    const data = this.slotsService.remove(id);
    return success('Slot deleted', data);
  }
}