import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { success } from '../common/utils/envelope';
import { ROLES } from '../users/roles';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

interface RequestWithUser {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('bookings')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.USER)
  create(@Body() body: CreateBookingDto, @Req() req: RequestWithUser) {
    const booking = this.bookingsService.create(req.user!, body);
    return success('Booking created', booking);
  }

  @Get('bookings/me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.USER)
  listMine(@Req() req: RequestWithUser) {
    const items = this.bookingsService.listMine(req.user!.id);
    return success('My bookings fetched', { items });
  }

  @Patch('bookings/:id/cancel')
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.USER)
  cancel(@Param('id') id: string, @Req() req: RequestWithUser) {
    const booking = this.bookingsService.cancel(req.user!, id);
    return success('Booking canceled', booking);
  }

  @Get('admin/bookings')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  listAdmin(@Query('status') status?: string) {
    const items = this.bookingsService.listAdmin(status);
    return success('Admin bookings fetched', { items });
  }

  @Patch('admin/bookings/:id/confirm')
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  confirm(@Param('id') id: string, @Req() req: RequestWithUser) {
    const booking = this.bookingsService.confirm(req.user!, id);
    return success('Booking confirmed', booking);
  }

  @Patch('admin/bookings/:id/reject')
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  reject(@Param('id') id: string, @Req() req: RequestWithUser) {
    const booking = this.bookingsService.reject(req.user!, id);
    return success('Booking rejected', booking);
  }

  @Patch('admin/bookings/:id/done')
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  done(@Param('id') id: string, @Req() req: RequestWithUser) {
    const booking = this.bookingsService.done(req.user!, id);
    return success('Booking done', booking);
  }
}