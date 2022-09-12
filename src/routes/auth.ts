import { AuthControllerObj as AuthController } from "../controller/Auth.controller";

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
export const auth = [
    {
        "@name": "login",
        "@path": "/login",
        "@httpMethod": "post",
        "@action": AuthController.login,
        "@guards": [],
    },
];
