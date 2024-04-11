import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) protected reportsRepository: Repository<Report>,
  ) {}

  async create(createReportDTO: CreateReportDTO, user: User) {
    const report = this.reportsRepository.create(createReportDTO);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  async findOneById(id: number) {
    return this.reportsRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }

  async updateApproval(id: string, approved: boolean) {
    const report = await this.findOneById(parseInt(id));

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.reportsRepository.save(report);
  }

  async getEstimate({ make, model, lng, lat, mileage, year }: GetEstimateDTO) {
    return this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved is true')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
