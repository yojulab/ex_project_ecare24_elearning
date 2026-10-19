import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('caregiver_terms')
export class CaregiverTermEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  term: string;

  @Column({ name: 'standard_term', length: 150 })
  standardTerm: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'text' })
  definition: string;

  @Column({ name: 'care_point', type: 'text', nullable: true })
  carePoint: string;

  @Column({ name: 'warning_alert', type: 'text', nullable: true })
  warningAlert: string;
}
