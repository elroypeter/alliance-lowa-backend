import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { SubscriberEntity } from '../entity/Subscriber.entity';
import { ISubcriber } from '../interface/subscriber.interface';
import { ResponseService } from './Response.service';

export class SubscriberService {
    async findAllSubscribers(): Promise<ISubcriber[]> {
        return await SubscriberEntity.find();
    }

    async saveSubscriber(email: string): Promise<ISubcriber> {
        const subscriber = new SubscriberEntity();
        subscriber.email = email;
        await subscriber.save();
        return subscriber;
    }

    async deleteSubscriber(ctx: Context, id: number): Promise<SubscriberEntity> {
        const subscriber: SubscriberEntity = await SubscriberEntity.findOne({ where: { id } });
        if (!subscriber) {
            ResponseService.throwReponseException(ctx, 'Subscriber with id not found', ResponseCode.BAD_REQUEST);
            return subscriber;
        }
        await SubscriberEntity.delete(subscriber.id);
        return subscriber;
    }
}
