import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from '../guards';
import { Serialize } from '../interceptors';
import { CurrentUser } from '../users/decorators';
import { User } from '../users/user.entity';
import { ApproveReportDTO, CreateReportDTO, ReportDTO } from './dtos';
import { ReportsService } from './reports.service';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Get('')
    async getEstimate(@Query() query: GetEstimateDTO) {
        console.log(query);
        return this.reportsService.getEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDTO)
    async createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    @Serialize(ReportDTO)
    async updateReport(@Param('id') id: string, @Body() body: ApproveReportDTO) {
        return this.reportsService.updateApproval(id, body.approved);
    }

}
