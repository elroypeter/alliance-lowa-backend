import { ProjectEntity } from '../entity/Project.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { IProject } from '../interface/project.interface';
import { translate } from '../locale/locale.service';

export class ProjectRepository extends Repository<ProjectEntity> {
    constructor(dataSource: DataSource) {
        super(ProjectEntity, dataSource.createEntityManager());
    }

    async findLocaleProject(langCode: string | undefined, pubStatus: boolean): Promise<IProject[]> {
        if (pubStatus) {
            return this.translateProject(
                await this.getProjectQuery(langCode)
                    .leftJoinAndSelect('project.isPublished', 'publishStatus')
                    .andWhere('publishStatus.entity = :entityP', { entityP: 'ProjectEntity' })
                    .andWhere('publishStatus.status = :pubStatus', { pubStatus })
                    .getMany(),
            );
        }
        return this.translateProject(await this.getProjectQuery(langCode).getMany());
    }

    async findOneLocaleProject(langCode: string | undefined, id: number): Promise<IProject | null> {
        const result = await this.getProjectQuery(langCode)
            .leftJoinAndSelect('project.isPublished', 'publishStatus')
            .andWhere('project.id = :id', { id })
            .getOne();
        if (result) {
            return this.translateProject([result])[0];
        } else {
            return null;
        }
    }

    private getProjectQuery(langCode: string | undefined): SelectQueryBuilder<ProjectEntity> {
        const code = langCode || 'en';
        return this.manager
            .createQueryBuilder(ProjectEntity, 'project')
            .leftJoinAndSelect('project.attachments', 'attachments')
            .leftJoinAndSelect('project.translations', 'projectTranslation')
            .where('projectTranslation.langCode = :code', { code });
    }

    private translateProject(result: ProjectEntity[]): IProject[] {
        return result.map((projectEntity: ProjectEntity) => translate<IProject>(projectEntity));
    }
}
