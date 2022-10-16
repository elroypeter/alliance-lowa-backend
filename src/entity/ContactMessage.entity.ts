import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { IContactMessage } from '../interface/contact-message.interface';

@Entity('contact-message')
export class ContactMessageEntity
  extends BaseEntity
  implements IContactMessage
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  mobile: string;

  @Column({ type: 'text' })
  message: string;
}
