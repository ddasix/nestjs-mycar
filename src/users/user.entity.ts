import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from '../reports/report.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'guest' })
  role: string;

  @OneToMany(() => Report, report => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with id: `, this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with id: `, this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Deleted User with id: `, this.id);
  }
}
