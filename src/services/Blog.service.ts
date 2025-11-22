import { Context } from 'koa';
import slugify from 'slugify';
import { BlogNewsEntity } from '../entity/BlogNews.entity';
import { BlogNewsTranslationEntity } from '../entity/BlogNewsTranslation.entity';
import { PublishStatusEntity } from '../entity/Publish.entity';
import { ResponseCode } from '../enums/response.enums';
import { IBlogNews, IBlogNewsDto } from '../interface/career-news.interface';
import { BlogRepository } from '../repository/Blog.repository';
import { CreateFile, DeleteFile } from './ManageFile.service';
import { ResponseService } from './Response.service';

export class BlogService {
    blogRepository: BlogRepository;
    constructor(blogRepository: BlogRepository) {
        this.blogRepository = blogRepository;
    }

    async getBlog(langCode?: string | undefined, isPublished?: boolean): Promise<IBlogNews[]> {
        const results = await this.blogRepository.findLocaleBlog(langCode, isPublished);
        return results;
    }

    async getAllBlog(): Promise<BlogNewsEntity[]> {
        const blogNewsEntity: BlogNewsEntity[] = await BlogNewsEntity.find({ relations: ['isPublished', 'translations'] });
        return blogNewsEntity;
    }

    async getOneBlog(ctx: Context, id: number): Promise<BlogNewsEntity> {
        const blogNewsEntity: BlogNewsEntity = await BlogNewsEntity.findOne({ where: { id }, relations: ['isPublished', 'translations'] });
        if (!blogNewsEntity) {
            ResponseService.throwReponseException(ctx, 'Blog with id not found', ResponseCode.BAD_REQUEST);
            return blogNewsEntity;
        }
        return blogNewsEntity;
    }

    async findOneBlog(ctx: Context, id: number, langCode?: string | undefined): Promise<IBlogNews> {
        const blog = await this.blogRepository.findOneLocaleBlog(langCode, id);
        if (!blog) {
            ResponseService.throwReponseException(ctx, 'Blog with id not found', ResponseCode.BAD_REQUEST);
            return blog;
        }
        return blog;
    }

    async saveBlog(blogDto: IBlogNewsDto): Promise<BlogNewsEntity[]> {
        const blogNewsTranslationEntity: BlogNewsTranslationEntity = new BlogNewsTranslationEntity();
        blogNewsTranslationEntity.title = blogDto.title;
        blogNewsTranslationEntity.slug = slugify(blogDto.title, { lower: true });
        blogNewsTranslationEntity.langCode = blogDto.langCode;
        blogNewsTranslationEntity.description = blogDto.description;
        await blogNewsTranslationEntity.save();

        const publishStatusEntity: PublishStatusEntity = new PublishStatusEntity();
        publishStatusEntity.entity = 'BlogEntity';
        publishStatusEntity.status = false;
        await publishStatusEntity.save();

        const blogNewsEntity: BlogNewsEntity = new BlogNewsEntity();
        const fileData = await CreateFile(blogDto.base64);
        blogNewsEntity.filePath = fileData.filePath;
        blogNewsEntity.translations = [blogNewsTranslationEntity];
        blogNewsEntity.isPublished = publishStatusEntity;
        await blogNewsEntity.save();

        return await BlogNewsEntity.find({ relations: ['isPublished', 'translations'] });
    }

    async addBlogTranslation(ctx: Context, blogDto: IBlogNewsDto, id: number): Promise<BlogNewsEntity> {
        const blogEntity: BlogNewsEntity = await BlogNewsEntity.findOne({ where: { id }, relations: ['translations'] });
        if (!blogEntity) {
            ResponseService.throwReponseException(ctx, 'Blog with id not found', ResponseCode.BAD_REQUEST);
            return blogEntity;
        }

        const blogNewsTranslationEntity: BlogNewsTranslationEntity = new BlogNewsTranslationEntity();
        blogNewsTranslationEntity.title = blogDto.title;
        blogNewsTranslationEntity.slug = slugify(blogDto.title, { lower: true });
        blogNewsTranslationEntity.langCode = blogDto.langCode;
        blogNewsTranslationEntity.description = blogDto.description;
        await blogNewsTranslationEntity.save();

        blogEntity.translations.push(blogNewsTranslationEntity);
        await blogEntity.save();
        return blogEntity;
    }

    async updateBlogTranslation(ctx: Context, blogDto: IBlogNewsDto, id: number): Promise<BlogNewsTranslationEntity> {
        const blogNewsTranslationEntity: BlogNewsTranslationEntity = await BlogNewsTranslationEntity.findOne({ where: { id } });
        if (!blogNewsTranslationEntity) {
            ResponseService.throwReponseException(ctx, 'Blog Translation with id not found', ResponseCode.BAD_REQUEST);
            return blogNewsTranslationEntity;
        }

        if (blogDto.title) blogDto.slug = slugify(blogDto.title, { lower: true });
        await BlogNewsTranslationEntity.getRepository().update({ id: blogNewsTranslationEntity.id }, { ...blogDto });
        return blogNewsTranslationEntity;
    }

    async changePublishStatus(ctx: Context, status: boolean, id: number): Promise<BlogNewsEntity> {
        const blogNewsEntity: BlogNewsEntity = await BlogNewsEntity.findOne({ where: { id }, relations: ['isPublished'] });
        if (!blogNewsEntity) {
            ResponseService.throwReponseException(ctx, 'Blog with id not found', ResponseCode.BAD_REQUEST);
            return blogNewsEntity;
        }
        await PublishStatusEntity.getRepository().update({ id: blogNewsEntity.isPublished.id }, { status });
        return blogNewsEntity;
    }

    async deleteBlog(ctx: Context, id: number): Promise<BlogNewsEntity> {
        const blogNewsEntity: BlogNewsEntity = await BlogNewsEntity.findOne({ where: { id }, relations: ['translations', 'isPublished'] });
        if (!blogNewsEntity) {
            ResponseService.throwReponseException(ctx, 'Blog with id not found', ResponseCode.BAD_REQUEST);
            return blogNewsEntity;
        }

        // Save references we need before deletion
        const publishStatusId = blogNewsEntity.isPublished?.id;
        const filePath = blogNewsEntity.filePath;

        // Step 1: Delete all translations first (they reference the blog entity)
        if (blogNewsEntity.translations && blogNewsEntity.translations.length > 0) {
            for (const translation of blogNewsEntity.translations) {
                await BlogNewsTranslationEntity.delete(translation.id);
            }
        }

        // Step 2: Delete the blog entity (this removes the FK constraint to publish-status)
        await BlogNewsEntity.delete(blogNewsEntity.id);

        // Step 3: Now we can safely delete publish status (blog entity no longer references it)
        if (publishStatusId) {
            await PublishStatusEntity.delete(publishStatusId);
        }

        // Step 4: Delete the file from filesystem
        if (filePath) {
            try {
                await DeleteFile(filePath);
            } catch (error) {
                // File might not exist, continue anyway
            }
        }

        return blogNewsEntity;
    }

    async updateBlogCover(ctx: Context, id: number, base64: string): Promise<BlogNewsEntity> {
        const blogNewsEntity: BlogNewsEntity = await BlogNewsEntity.findOne({ where: { id } });
        if (!blogNewsEntity) {
            ResponseService.throwReponseException(ctx, 'Blog with id not found', ResponseCode.BAD_REQUEST);
            return blogNewsEntity;
        }

        // Delete old file if it exists
        if (blogNewsEntity.filePath) {
            try {
                await DeleteFile(blogNewsEntity.filePath);
            } catch (error) {
                // File might not exist, continue anyway
            }
        }

        // Create new file
        const fileData = await CreateFile(base64);
        blogNewsEntity.filePath = fileData.filePath;
        await blogNewsEntity.save();

        return await BlogNewsEntity.findOne({ where: { id }, relations: ['isPublished', 'translations'] });
    }
}
