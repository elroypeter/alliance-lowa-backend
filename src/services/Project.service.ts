import { ProjectEntity } from '../entity/Project.entity';
import { ProjectTranslationEntity } from '../entity/ProjectTranslationEntity';
import { PublishStatusEntity } from '../entity/Publish.entity';
import { IProject, IProjectAttachmentDto, IProjectDto } from '../interface/project.interface';
import { ProjectRepository } from '../repository/Project.repository';
import slugify from 'slugify';
import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { ResponseService } from './Response.service';
import { ProjectAttachmentEntity } from '../entity/ProjectAttachment.entity';
import { CreateFile } from './ManageFile.service';

export class ProjectService {
    projectRepository: ProjectRepository;
    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async getProjects(langCode?: string | undefined, isPublished?: boolean): Promise<IProject[]> {
        const results = await this.projectRepository.findLocaleProject(langCode, isPublished);
        return results;
    }

    async findOneProject(ctx: Context, id: number, langCode?: string | undefined): Promise<IProject> {
        const project = await this.projectRepository.findOneLocaleProject(langCode, id);
        if (!project) {
            ResponseService.throwReponseException(ctx, 'Project with id not found', ResponseCode.BAD_REQUEST);
            return project;
        }
        return project;
    }

    async saveProject(projectDto: IProjectDto): Promise<ProjectEntity[]> {
        const projectTranslationEntity: ProjectTranslationEntity = new ProjectTranslationEntity();
        projectTranslationEntity.title = projectDto.title;
        projectTranslationEntity.slug = slugify(projectDto.title, { lower: true });
        projectTranslationEntity.langCode = projectDto.langCode;
        projectTranslationEntity.description = projectDto.description;
        await projectTranslationEntity.save();

        const publishStatusEntity: PublishStatusEntity = new PublishStatusEntity();
        publishStatusEntity.entity = 'ProjectEntity';
        publishStatusEntity.status = false;
        await publishStatusEntity.save();

        const projectEntity: ProjectEntity = new ProjectEntity();
        projectEntity.translations = [projectTranslationEntity];
        projectEntity.isPublished = publishStatusEntity;
        await projectEntity.save();

        return await ProjectEntity.find({ relations: ['isPublished', 'translations', 'attachments'] });
    }

    async addProjectTranslation(ctx: Context, projectDto: IProjectDto, id: number): Promise<ProjectEntity> {
        const projectEntity: ProjectEntity = await ProjectEntity.findOne({ where: { id }, relations: ['translations'] });
        if (!projectEntity) {
            ResponseService.throwReponseException(ctx, 'Project with id not found', ResponseCode.BAD_REQUEST);
            return projectEntity;
        }

        const projectTranslationEntity: ProjectTranslationEntity = new ProjectTranslationEntity();
        projectTranslationEntity.title = projectDto.title;
        projectTranslationEntity.slug = slugify(projectDto.title, { lower: true });
        projectTranslationEntity.langCode = projectDto.langCode;
        projectTranslationEntity.description = projectDto.description;
        await projectTranslationEntity.save();

        projectEntity.translations.push(projectTranslationEntity);
        await projectEntity.save();
        return projectEntity;
    }

    async addProjectAttachment(ctx: Context, projectAttachmentDto: IProjectAttachmentDto, id: number): Promise<ProjectEntity> {
        const projectEntity: ProjectEntity = await ProjectEntity.findOne({ where: { id }, relations: ['attachments'] });
        if (!projectEntity) {
            ResponseService.throwReponseException(ctx, 'Project with id not found', ResponseCode.BAD_REQUEST);
            return projectEntity;
        }

        const fileData = await CreateFile(projectAttachmentDto.base64);
        const projectAttachmentEntity: ProjectAttachmentEntity = new ProjectAttachmentEntity();
        projectAttachmentEntity.isVideo = projectAttachmentDto.isVideo;
        projectAttachmentEntity.filePath = fileData.filePath;
        await projectAttachmentEntity.save();

        projectEntity.attachments.push(projectAttachmentEntity);
        await projectEntity.save();
        return projectEntity;
    }

    async updateProjectTranslation(ctx: Context, projectDto: IProjectDto, id: number): Promise<ProjectTranslationEntity> {
        const projectTranslationEntity: ProjectTranslationEntity = await ProjectTranslationEntity.findOne({ where: { id } });
        if (!projectTranslationEntity) {
            ResponseService.throwReponseException(ctx, 'Project Translation with id not found', ResponseCode.BAD_REQUEST);
            return projectTranslationEntity;
        }

        if (projectDto.title) projectDto.slug = slugify(projectDto.title, { lower: true });
        await ProjectTranslationEntity.getRepository().update({ id: projectTranslationEntity.id }, { ...projectDto });
        return projectTranslationEntity;
    }

    async changePublishStatus(ctx: Context, status: boolean, id: number): Promise<ProjectEntity> {
        const projectEntity: ProjectEntity = await ProjectEntity.findOne({ where: { id }, relations: ['isPublished'] });
        if (!projectEntity) {
            ResponseService.throwReponseException(ctx, 'Project with id not found', ResponseCode.BAD_REQUEST);
            return projectEntity;
        }
        await PublishStatusEntity.getRepository().update({ id: projectEntity.isPublished.id }, { status });
        return projectEntity;
    }

    async deleteProject(ctx: Context, id: number): Promise<ProjectEntity> {
        const projectEntity: ProjectEntity = await ProjectEntity.findOne({ where: { id } });
        if (!projectEntity) {
            ResponseService.throwReponseException(ctx, 'Project with id not found', ResponseCode.BAD_REQUEST);
            return projectEntity;
        }
        await ProjectEntity.delete(projectEntity.id);
        return projectEntity;
    }

    async deleteProjectAttachment(ctx: Context, id: number): Promise<ProjectAttachmentEntity> {
        const projectAttachmentEntity: ProjectAttachmentEntity = await ProjectAttachmentEntity.findOne({ where: { id } });
        if (!projectAttachmentEntity) {
            ResponseService.throwReponseException(ctx, 'Project Attachment with id not found', ResponseCode.BAD_REQUEST);
            return projectAttachmentEntity;
        }
        await ProjectAttachmentEntity.delete(projectAttachmentEntity.id);
        return projectAttachmentEntity;
    }
}
