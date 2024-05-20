import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // ManyToOne,
  CreateDateColumn,
} from 'typeorm';
// import { Account } from './account.entity';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 20 })
  Account: string;

  @Column({ type: 'varchar', length: 12 })
  Symbol: string;

  @Column({ type: 'int' })
  Fills: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  LastPx: string;

  @Column({ type: 'int' })
  SharesTraded: number;

  @Column({ type: 'int' })
  PosQty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  PosAvg: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Exp: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  RealPnl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  UnrealPnl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  TotalPnl: string;

  // @ManyToOne(() => Account, (account) => account.trades)
  // account: Account;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
