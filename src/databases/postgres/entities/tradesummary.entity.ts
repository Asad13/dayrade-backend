import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('tradesummaries')
export class TradeSummary {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  balance: string;

  @Column({ type: 'int' })
  totalSharesTraded: number;

  @Column({ type: 'int' })
  totalStocksTraded: number;

  @Column({ type: 'int' })
  totalTrades: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalNotionalTraded: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPnl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalRealPnl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalUnrealPnl: string;

  @ManyToOne(() => Account, (account) => account.tradesummaries)
  account: Account;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
