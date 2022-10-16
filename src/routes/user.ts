import { UserControllerObj as UserController } from "../controller/User.controller";
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
export const user = [
    // {
    //     "@name": "getUsers",
    //     "@path": "/user",
    //     "@httpMethod": "get",
    //     "@action": UserController.getUsers,
    //     "@guards": [authGuard],
    // },
    // {
    //     "@name": "saveUser",
    //     "@path": "/user",
    //     "@httpMethod": "post",
    //     "@action": UserController.saveUser,
    //     "@guards": [],
    // },
    // {
    //     "@name": "deleteUser",
    //     "@path": "/user/:id",
    //     "@httpMethod": "delete",
    //     "@action": UserController.deleteUser,
    //     "@guards": [authGuard],
    // },
];
