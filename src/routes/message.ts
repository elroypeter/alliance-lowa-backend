import { MessageControllerObj as MessageController } from "../controller/MessageController";
import { authGuard } from "../middleware/auth.middleware";

/**
 * routes format
 *     {
 *       "@name": "route name",
 *       "@path": "/path_url",
 *       "@httpMethod": "get|post|put|patch|delete",
 *       "@action": controller method,
 *       "@guards": [middlewares and generators],
 *    }
 */
export const message = [
    // {
    //     "@name": "getMessages",
    //     "@path": "/messages",
    //     "@httpMethod": "get",
    //     "@action": MessageController.getMessages,
    //     "@guards": [authGuard],
    // },
    // {
    //     "@name": "saveMessage",
    //     "@path": "/contact-message",
    //     "@httpMethod": "post",
    //     "@action": MessageController.saveMessage,
    //     "@guards": [],
    // },
];
