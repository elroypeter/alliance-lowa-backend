import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { IBlogNews, IBlogNewsDto } from '../interface/career-news.interface';
import { ResponseService } from '../services/Response.service';
import { RouteAction } from '../types/route.types';
import { App } from '../bootstrap';
import { BlogRepository } from '../repository/Blog.repository';
import { BlogService } from '../services/Blog.service';
import { BlogNewsEntity } from '../entity/BlogNews.entity';
import { BlogNewsTranslationEntity } from '../entity/BlogNewsTranslation.entity';

class BlogController {
    blogService: BlogService;
    constructor(blogService: BlogService) {
        this.blogService = blogService;
    }

    getBlog = async (ctx: Context): Promise<RouteAction> => {
        const { langCode, isPublished } = ctx.request.query as { [x: string]: string & undefined };
        const blogs: IBlogNews[] = await this.blogService.getBlog(langCode, isPublished === 'true' ? true : false);
        ResponseService.res(ctx, ResponseCode.OK, blogs);
        return;
    };

    getAllBlog = async (ctx: Context): Promise<RouteAction> => {
        const blogs: BlogNewsEntity[] = await this.blogService.getAllBlog();
        ResponseService.res(ctx, ResponseCode.OK, blogs);
        return;
    };

    getOneBlog = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const blog: BlogNewsEntity = await this.blogService.getOneBlog(ctx, id);
        ResponseService.res(ctx, ResponseCode.OK, blog);
        return;
    };

    getSingleBlog = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const { langCode } = ctx.request.query as { [x: string]: string & undefined };
        const blog = await this.blogService.findOneBlog(ctx, id, langCode);
        if (!blog) return;
        ResponseService.res(ctx, ResponseCode.OK, blog);
        return;
    };

    saveBlog = async (ctx: Context): Promise<RouteAction> => {
        const blogDto: IBlogNewsDto = ctx.request.body;
        const blogs: BlogNewsEntity[] = await this.blogService.saveBlog(blogDto);
        ResponseService.res(ctx, ResponseCode.CREATED, blogs);
        return;
    };

    addBlogTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const blogDto: IBlogNewsDto = ctx.request.body;
        const blog: BlogNewsEntity = await this.blogService.addBlogTranslation(ctx, blogDto, id);
        ResponseService.res(ctx, ResponseCode.CREATED, blog);
        return;
    };

    updateBlogTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const blogDto: IBlogNewsDto = ctx.request.body;
        const blogNewsTranslationEntity: BlogNewsTranslationEntity = await this.blogService.updateBlogTranslation(ctx, blogDto, id);
        ResponseService.res(ctx, ResponseCode.CREATED, blogNewsTranslationEntity);
        return;
    };

    changePublishStatus = async (ctx: Context): Promise<RouteAction> => {
        const { status } = ctx.request.body;
        const id: number = parseInt(ctx.params.id);
        const blog: BlogNewsEntity = await this.blogService.changePublishStatus(ctx, status, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, blog);
        return;
    };

    deleteBlog = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const blog: BlogNewsEntity = await this.blogService.deleteBlog(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, blog);
        return;
    };
}

export const getBlogController = (app: App) => new BlogController(new BlogService(new BlogRepository(app.dataSource)));
