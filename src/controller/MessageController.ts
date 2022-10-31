import { RouteAction } from '../types/route.types';
import { MessageService } from '../services/Message.service';
import { Context } from 'koa';
import { App } from '../bootstrap';
import { IContactMessage } from '../interface/contact-message.interface';
import { ResponseService } from '../services/Response.service';
import { ResponseCode } from '../enums/response.enums';

class MessageController {
    messageService: MessageService;
    constructor(messageService: MessageService) {
        this.messageService = messageService;
    }

    getMessage = async (ctx: Context): Promise<RouteAction> => {
        const message: IContactMessage[] = await this.messageService.findAllMessages();
        ResponseService.res(ctx, ResponseCode.OK, message);
        return;
    };

    getSingleMessage = async (ctx: Context): Promise<RouteAction> => {
        const { id } = ctx.params.id;
        const message = await this.messageService.findOneMessages(ctx, id);
        if (!message) return;
        ResponseService.res(ctx, ResponseCode.OK, message);
        return;
    };

    saveMessage = async (ctx: Context): Promise<RouteAction> => {
        const { message, email, mobile, name } = ctx.request.body;
        const newMessage = await this.messageService.saveMessage({ message, email, mobile, name });
        ResponseService.res(ctx, ResponseCode.CREATED, newMessage);
        return;
    };

    deleteMessage = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const message = await this.messageService.deleteMessage(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, message);
        return;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getMessageController = (app: App) => new MessageController(new MessageService());
