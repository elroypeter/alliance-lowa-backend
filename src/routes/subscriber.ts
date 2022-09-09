import { SubscriberControllerObj as SubscriberController } from "../controller/Subscriber.controller";

/**
 * routes format
 *     {
 *       "@name": "route name",
 *       "@path": "/path_url",
 *       "@httpMethod": "get|post|put|patch|delete",
 *       "@action": controller method,
 *       "@guards": [middleware, generators],
 *    }
 */
export const subscriber = [
    {
        "@name": "getSubscribers",
        "@path": "/subscriber",
        "@httpMethod": "get",
        "@action": SubscriberController.getSubscribers,
        "@guards": [],
    },
    {
        "@name": "saveSubscriber",
        "@path": "/subscriber",
        "@httpMethod": "post",
        "@action": SubscriberController.saveSubscriber,
        "@guards": [],
    },
    {
        "@name": "deleteSubscriber",
        "@path": "/subscriber/:id",
        "@httpMethod": "delete",
        "@action": SubscriberController.deleteSubscriber,
        "@guards": [],
    },
];
