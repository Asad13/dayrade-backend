import { Entity, PrimaryColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
// import { Trade } from './trade.entity';
import { TradeSummary } from './tradesummary.entity';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryColumn({ unique: true, length: 20 })
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  balance: string;

  // @ManyToOne(() => User, (user) => user.accounts, { nullable: true })
  // user: User;
  @OneToOne(() => User, (user) => user.account)
  user: User;

  // @OneToMany(() => Trade, (trade) => trade.account)
  // trades: Trade[];

  @OneToMany(() => TradeSummary, (tradeSummary) => tradeSummary.account)
  tradesummaries: TradeSummary[];
}
