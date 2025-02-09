import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Profile } from './profile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ length: 100, nullable: true })
  // first_name: string;

  // @Column({ length: 100, nullable: true })
  // last_name: string;

  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  // @Column({ length: 255, nullable: true })
  // alt_email: string;

  @Column({ unique: true, length: 50 })
  user_name: string;

  // @Column({ nullable: true })
  // profile_image_path: string;

  // @Column({ length: 100, nullable: true })
  // job_title: string;

  @Column({ length: 1024, nullable: true })
  password: string;

  // @Column({
  //   type: 'date',
  //   nullable: true,
  // })
  // dob: Date;

  // @Column({
  //   nullable: true,
  //   length: 500,
  // })
  // bio: string;

  // @OneToMany(() => Account, (account) => account.user)
  // accounts: Account[];

  @OneToOne(() => Account, (account) => account.user, { nullable: true })
  @JoinColumn()
  account: Account;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

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
