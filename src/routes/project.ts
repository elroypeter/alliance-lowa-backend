import { authGuard } from '../middleware/auth.middleware';
import { App } from '../bootstrap';
import { Route } from '../types/route.types';
import { getProjectController } from '../controller/ProjectController';

export const project = (app: App): Route[] => [
    {
        name: 'getProjects',
        path: '/api/project',
        httpMethod: 'get',
        action: getProjectController(app).getProject,
        guards: [authGuard],
    },
    {
        name: 'getPublicProjects',
        path: '/api/public/project',
        httpMethod: 'get',
        action: getProjectController(app).getProject,
        guards: [],
    },
    {
        name: 'getSingleProject',
        path: '/api/project/:id',
        httpMethod: 'get',
        action: getProjectController(app).getSingleProject,
        guards: [authGuard],
    },
    {
        name: 'getPublicSingleProject',
        path: '/api/public/project/:id',
        httpMethod: 'get',
        action: getProjectController(app).getSingleProject,
        guards: [],
    },
    {
        name: 'saveProject',
        path: '/api/project',
        httpMethod: 'post',
        action: getProjectController(app).saveProject,
        guards: [authGuard],
    },
    {
        name: 'addProjectTranslation',
        path: '/api/project/translation/:id',
        httpMethod: 'post',
        action: getProjectController(app).addProjectTranslation,
        guards: [authGuard],
    },
    {
        name: 'updateProjectTranslation',
        path: '/api/project/translation/:id',
        httpMethod: 'put',
        action: getProjectController(app).updateProjectTranslation,
        guards: [authGuard],
    },
    {
        name: 'addProjectAttachment',
        path: '/api/project/attachment/:id',
        httpMethod: 'post',
        action: getProjectController(app).addProjectAttachment,
        guards: [authGuard],
    },
    {
        name: 'deleteProjectAttachment',
        path: '/api/project/attachment/:id',
        httpMethod: 'delete',
        action: getProjectController(app).deleteProjectAttachment,
        guards: [authGuard],
    },
    {
        name: 'publishProject',
        path: '/api/project/publish/:id',
        httpMethod: 'put',
        action: getProjectController(app).changePublishStatus,
        guards: [authGuard],
    },
    {
        name: 'deleteProject',
        path: '/api/project/:id',
        httpMethod: 'delete',
        action: getProjectController(app).deleteProject,
        guards: [authGuard],
    },
];
