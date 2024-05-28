import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { CountryCode } from '@apptypes/country.type';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, nullable: true, default: null })
  first_name: string;

  @Column({ length: 100, nullable: true, default: null })
  last_name: string;

  @Column({ default: false })
  show_name: boolean;

  @Column({ nullable: true, default: null })
  profile_image_path: string;

  @Column({
    type: 'enum',
    enum: CountryCode,
    nullable: true,
  })
  country: CountryCode;

  @Column({ length: 255, nullable: true, default: null })
  alt_email: string;

  @Column({ length: 100, nullable: true, default: null })
  job_title: string;

  @Column({ default: false })
  show_job_title: boolean;

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  dob: Date;

  @Column({ default: false })
  show_dob: boolean;

  @Column({
    nullable: true,
    length: 500,
    default: null,
  })
  bio: string;

  @Column({ length: 100, nullable: true, default: null })
  twitch_account: string;

  @Column({ default: false })
  show_twitch_account: boolean;

  @Column({ length: 100, nullable: true, default: null })
  discord_account: string;

  @Column({ default: false })
  show_discord_account: boolean;

  @Column({ length: 100, nullable: true, default: null })
  twitter_account: string;

  @Column({ default: false })
  show_twitter_account: boolean;

  @Column({ length: 100, nullable: true, default: null })
  instagram_account: string;

  @Column({ default: false })
  show_instagram_account: boolean;

  @Column({ length: 100, nullable: true, default: null })
  linkedin_account: string;

  @Column({ default: false })
  show_linkedin_account: boolean;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
