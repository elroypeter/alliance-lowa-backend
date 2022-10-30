import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { IProject, IProjectAttachmentDto, IProjectDto } from '../interface/project.interface';
import { ResponseService } from '../services/Response.service';
import { RouteAction } from '../types/route.types';
import { App } from '../bootstrap';
import { ProjectRepository } from '../repository/Project.repository';
import { ProjectService } from '../services/Project.service';
import { ProjectEntity } from '../entity/Project.entity';
import { ProjectTranslationEntity } from '../entity/ProjectTranslationEntity';
import { ProjectAttachmentEntity } from '../entity/ProjectAttachment.entity';
class ProjectController {
    projectService: ProjectService;
    constructor(projectService: ProjectService) {
        this.projectService = projectService;
    }

    getProject = async (ctx: Context): Promise<RouteAction> => {
        const { langCode, isPublished } = ctx.request.query as { [x: string]: string & undefined };
        const projects: IProject[] = await this.projectService.getProjects(langCode, isPublished === 'true' ? true : false);
        ResponseService.res(ctx, ResponseCode.OK, projects);
        return;
    };

    getAllProject = async (ctx: Context): Promise<RouteAction> => {
        const projects: ProjectEntity[] = await this.projectService.getAllProjects();
        ResponseService.res(ctx, ResponseCode.OK, projects);
        return;
    };

    getOneProject = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const project = await this.projectService.getSingleProjects(ctx, id);
        if (!project) return;
        ResponseService.res(ctx, ResponseCode.OK, project);
        return;
    };

    getSingleProject = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const { langCode } = ctx.request.query as { [x: string]: string & undefined };
        const project = await this.projectService.findOneProject(ctx, id, langCode);
        if (!project) return;
        ResponseService.res(ctx, ResponseCode.OK, project);
        return;
    };

    saveProject = async (ctx: Context): Promise<RouteAction> => {
        const projectDto: IProjectDto = ctx.request.body;
        const projects: ProjectEntity[] = await this.projectService.saveProject(projectDto);
        ResponseService.res(ctx, ResponseCode.CREATED, projects);
        return;
    };

    addProjectTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const projectDto: IProjectDto = ctx.request.body;
        const projects: ProjectEntity = await this.projectService.addProjectTranslation(ctx, projectDto, id);
        ResponseService.res(ctx, ResponseCode.CREATED, projects);
        return;
    };

    deleteProjectTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const projects: ProjectTranslationEntity = await this.projectService.deleteProjectTranslation(ctx, id);
        ResponseService.res(ctx, ResponseCode.CREATED, projects);
        return;
    };

    addProjectAttachment = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const projectAttachmentDto: IProjectAttachmentDto = ctx.request.body;
        const projects: ProjectEntity = await this.projectService.addProjectAttachment(ctx, projectAttachmentDto, id);
        ResponseService.res(ctx, ResponseCode.CREATED, projects);
        return;
    };

    updateProjectTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const projectDto: IProjectDto = ctx.request.body;
        const projectTranslation: ProjectTranslationEntity = await this.projectService.updateProjectTranslation(ctx, projectDto, id);
        ResponseService.res(ctx, ResponseCode.CREATED, projectTranslation);
        return;
    };

    changePublishStatus = async (ctx: Context): Promise<RouteAction> => {
        const { status } = ctx.request.body;
        const id: number = parseInt(ctx.params.id);
        const project: ProjectEntity = await this.projectService.changePublishStatus(ctx, status, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, project);
        return;
    };

    deleteProject = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const project: ProjectEntity = await this.projectService.deleteProject(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, project);
        return;
    };

    deleteProjectAttachment = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const projectAttachmentEntity: ProjectAttachmentEntity = await this.projectService.deleteProjectAttachment(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, projectAttachmentEntity);
        return;
    };
}

export const getProjectController = (app: App) => new ProjectController(new ProjectService(new ProjectRepository(app.dataSource)));
