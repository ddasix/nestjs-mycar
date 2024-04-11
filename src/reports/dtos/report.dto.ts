import { Expose, Transform } from 'class-transformer';
import { UserDTO } from '../../users/dtos';

export class ReportDTO {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  userId: number;

  @Expose()
  @Transform(({ obj }) => ({
    id: obj.user.id,
    email: obj.user.email,
  }))
  user: UserDTO;
}
