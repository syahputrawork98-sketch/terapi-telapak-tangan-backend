import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { success } from '../common/utils/envelope';
import { ROLES } from '../users/roles';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SuperAdminService } from './super-admin.service';

@Controller('super-admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLES.SUPER_ADMIN)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('admins')
  createAdmin(@Body() body: CreateAdminDto) {
    const user = this.superAdminService.createAdmin(body);
    return success('Admin created', user);
  }

  @Get('admins')
  listAdmins() {
    const items = this.superAdminService.listAdmins();
    return success('Admin list fetched', { items });
  }

  @Patch('admins/:id')
  @HttpCode(200)
  updateAdmin(@Param('id') id: string, @Body() body: UpdateAdminDto) {
    const user = this.superAdminService.updateAdmin(id, body);
    return success('Admin updated', user);
  }
}
