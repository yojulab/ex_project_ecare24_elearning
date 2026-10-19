import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('golden_rules')
export class GoldenRuleEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'rule_no', unique: true })
  ruleNo: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'bad_case', type: 'text', nullable: true })
  badCase: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
