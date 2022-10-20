import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { IProject, IProjectDto } from '../interface/project.interface';
import { ResponseService } from '../services/Response.service';
import { RouteAction } from '../types/route.types';
import { App } from '../bootstrap';
import { ProjectRepository } from '../repository/Project.repository';
import { ProjectService } from '../services/Project.service';
import { ProjectEntity } from '../entity/Project.entity';
import { ProjectTranslationEntity } from '../entity/ProjectTranslationEntity';
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

    // async addImage(ctx: Context, next: Next) {
    //     const projects: Project[] = await Project.find({
    //         where: { id: ctx.params.id },
    //         relations: ["images"],
    //     });
    //     const { image } = ctx.request.body;
    //     const projectImage: ProjectImage = new ProjectImage();
    //     const fileData = await CreateFile(image);
    //     projectImage.imageData = fileData.image;
    //     projectImage.filePath = fileData.filePath;
    //     await projectImage.save();
    //     projects[0].images.push(projectImage);
    //     await projects[0].save();
    //     ctx.body = { message: "saved successfully" };
    //     ctx.status = 200;
    // }
    // async removeImage(ctx: Context, next: Next) {
    //     const projectImage: ProjectImage = await ProjectImage.findOneBy({
    //         id: ctx.params.id,
    //     });
    //     await DeleteFile(projectImage.filePath);
    //     await projectImage.remove();
    //     ctx.body = { message: "removed successfully" };
    //     ctx.status = 200;
    // }
}

export const getProjectController = (app: App) => new ProjectController(new ProjectService(new ProjectRepository(app.dataSource)));
