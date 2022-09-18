import { ProjectControllerObj as ProjectController } from "../controller/ProjectController";
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
export const project = [
    {
        "@name": "getProjects",
        "@path": "/project",
        "@httpMethod": "get",
        "@action": ProjectController.getProjects,
        "@guards": [authGuard],
    },
    {
        "@name": "getProject",
        "@path": "/project/:id",
        "@httpMethod": "get",
        "@action": ProjectController.getProjectDetails,
        "@guards": [authGuard],
    },
    {
        "@name": "saveProject",
        "@path": "/project",
        "@httpMethod": "post",
        "@action": ProjectController.saveProject,
        "@guards": [],
    },
    {
        "@name": "updateProject",
        "@path": "/project/:id",
        "@httpMethod": "put",
        "@action": ProjectController.updateProject,
        "@guards": [authGuard],
    },
    {
        "@name": "addProjectImage",
        "@path": "/project/add-image/:id",
        "@httpMethod": "put",
        "@action": ProjectController.addImage,
        "@guards": [authGuard],
    },
    {
        "@name": "deleteProject",
        "@path": "/project/:id",
        "@httpMethod": "delete",
        "@action": ProjectController.deleteProject,
        "@guards": [authGuard],
    },
    {
        "@name": "removeProjectImage",
        "@path": "/project/remove-image/:id",
        "@httpMethod": "delete",
        "@action": ProjectController.removeImage,
        "@guards": [authGuard],
    },
    {
        "@name": "publishProject",
        "@path": "/project/publish/:id",
        "@httpMethod": "put",
        "@action": ProjectController.publishProject,
        "@guards": [authGuard],
    },
];
