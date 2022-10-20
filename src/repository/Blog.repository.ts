import { BlogNewsEntity } from '../entity/BlogNews.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { IBlogNews } from '../interface/career-news.interface';
import { translate } from '../locale/locale.service';

export class BlogRepository extends Repository<BlogNewsEntity> {
    constructor(dataSource: DataSource) {
        super(BlogNewsEntity, dataSource.createEntityManager());
    }

    async findLocaleBlog(langCode: string | undefined, pubStatus: boolean): Promise<IBlogNews[]> {
        if (pubStatus) {
            return this.translateBlog(
                await this.getBlogQuery(langCode)
                    .leftJoinAndSelect('blog.isPublished', 'publishStatus')
                    .andWhere('publishStatus.entity = :entityB', { entityB: 'BlogEntity' })
                    .andWhere('publishStatus.status = :pubStatus', { pubStatus })
                    .getMany(),
            );
        }
        return this.translateBlog(await this.getBlogQuery(langCode).getMany());
    }

    async findOneLocaleBlog(langCode: string | undefined, id: number): Promise<IBlogNews | null> {
        const result = await this.getBlogQuery(langCode)
            .leftJoinAndSelect('blog.isPublished', 'publishStatus')
            .andWhere('blog.id = :id', { id })
            .getOne();
        if (result) {
            return this.translateBlog([result])[0];
        } else {
            return null;
        }
    }

    private getBlogQuery(langCode: string | undefined): SelectQueryBuilder<BlogNewsEntity> {
        const code = langCode || 'en';
        return this.manager
            .createQueryBuilder(BlogNewsEntity, 'blog')
            .leftJoinAndSelect('blog.translations', 'blogTranslation')
            .where('blogTranslation.langCode = :code', { code });
    }

    private translateBlog(result: BlogNewsEntity[]): IBlogNews[] {
        return result.map((blogEntity: BlogNewsEntity) => translate<IBlogNews>(blogEntity));
    }
}
