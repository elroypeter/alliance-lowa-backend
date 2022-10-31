import { Context } from 'koa';
import { ContactMessageEntity } from '../entity/ContactMessage.entity';
import { ResponseCode } from '../enums/response.enums';
import { IContactMessage } from '../interface/contact-message.interface';
import { ResponseService } from './Response.service';

export class MessageService {
    async findAllMessages(): Promise<IContactMessage[]> {
        return await ContactMessageEntity.find();
    }

    async findOneMessages(ctx: Context, id): Promise<IContactMessage> {
        const contactMessage = await ContactMessageEntity.findOne({ where: { id } });
        if (!contactMessage) {
            ResponseService.throwReponseException(ctx, 'Message with id not found', ResponseCode.BAD_REQUEST);
            return contactMessage;
        }
        return contactMessage;
    }

    async saveMessage(data: any): Promise<IContactMessage> {
        const message = new ContactMessageEntity();
        message.email = data.email;
        message.mobile = data.mobile;
        message.message = data.message;
        message.name = data.name;
        await message.save();
        return message;
    }

    async deleteMessage(ctx: Context, id: number): Promise<ContactMessageEntity> {
        const message: ContactMessageEntity = await ContactMessageEntity.findOne({ where: { id } });
        if (!message) {
            ResponseService.throwReponseException(ctx, 'Message with id not found', ResponseCode.BAD_REQUEST);
            return message;
        }
        await ContactMessageEntity.delete(message.id);
        return message;
    }
}
