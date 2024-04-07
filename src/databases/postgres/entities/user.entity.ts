import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CountryCode } from '@apptypes/country.type';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  first_name: string;

  @Column({ length: 100, nullable: true })
  last_name: string;

  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  alt_email: string;

  @Column({ unique: true, length: 50, nullable: true })
  user_name: string;

  @Column({ nullable: true })
  profile_image_path: string;

  @Column({ length: 100, nullable: true })
  job_title: string;

  @Column({ length: 1024, nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: CountryCode,
    nullable: true,
  })
  country: CountryCode;

  @Column({
    type: 'date',
    nullable: true,
  })
  dob: Date;

  @Column({
    nullable: true,
    length: 500,
  })
  bio: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
