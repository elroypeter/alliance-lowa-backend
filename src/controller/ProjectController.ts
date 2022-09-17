import { Context, Next } from "koa";
import { Project } from "../entity/Project";
import { ProjectImage } from "../entity/ProjectImage";

class ProjectController {
    constructor() {}

    async getProjects(ctx: Context, next: Next) {
        const project: Project[] = await Project.find();
        ctx.status = 200;
        ctx.body = project;
    }

    async saveProject(ctx: Context, next: Next) {
        const project: Project = new Project();
        const { title, description } = ctx.request.body;

        project.title = title;
        project.description = description;

        await project.save();
        ctx.body = { message: "saved successfully" };
        ctx.status = 200;
    }

    async addImage(ctx: Context, next: Next) {
        const project: Project = await Project.findOneBy({
            id: ctx.params.id,
        });

        const { image } = ctx.request.body;
        const projectImage: ProjectImage = new ProjectImage();
        projectImage.imageData = image;

        project.images.push(projectImage);
        await project.save();
        ctx.body = { message: "saved successfully" };
        ctx.status = 200;
    }

    async removeImage(ctx: Context, next: Next) {
        const projectImage: ProjectImage = await ProjectImage.findOneBy({
            id: ctx.params.id,
        });
        await projectImage.remove();
        ctx.body = { message: "removed successfully" };
        ctx.status = 200;
    }

    async updateProject(ctx: Context, next: Next) {
        const project: Project = await Project.findOneBy({
            id: ctx.params.id,
        });

        const { title, description } = ctx.request.body;

        project.title = title;
        project.description = description;

        await project.save();
        ctx.body = { message: "updated successfully" };
        ctx.status = 200;
    }

    async publishProject(ctx: Context, next: Next) {
        const project: Project = await Project.findOneBy({
            id: ctx.params.id,
        });

        project.isPublished = ctx.request.body.status;
        await project.save();
        ctx.body = { message: "published successfully" };
        ctx.status = 200;
    }

    async deleteProject(ctx: Context, next: Next) {
        const project: Project = await Project.findOneBy({
            id: ctx.params.id,
        });
        await project.remove();
        ctx.body = { message: "removed successfully" };
        ctx.status = 200;
    }
}

export const ProjectControllerObj = new ProjectController();
