import { Context } from 'koa';
import { RouteAction } from 'src/types/route.types';
import { App } from '../bootstrap';
import { ResponseCode } from '../enums/response.enums';
import { ISubcriber } from '../interface/subscriber.interface';
import { ResponseService } from '../services/Response.service';
import { SubscriberService } from '../services/Subscriber.service';

class SubscriberController {
    subscriberService: SubscriberService;
    constructor(subscriberService: SubscriberService) {
        this.subscriberService = subscriberService;
    }

    getSubscriber = async (ctx: Context): Promise<RouteAction> => {
        const subscribers: ISubcriber[] = await this.subscriberService.findAllSubscribers();
        ResponseService.res(ctx, ResponseCode.OK, subscribers);
        return;
    };

    saveSubscriber = async (ctx: Context): Promise<RouteAction> => {
        const { email } = ctx.request.body;
        const subscriber = await this.subscriberService.saveSubscriber(email);
        ResponseService.res(ctx, ResponseCode.CREATED, subscriber);
        return;
    };

    deleteSubscriber = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const subscriber = await this.subscriberService.deleteSubscriber(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, subscriber);
        return;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubscriberController = (app?: App) => new SubscriberController(new SubscriberService());
