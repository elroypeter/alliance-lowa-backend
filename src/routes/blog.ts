import { authGuard } from '../middleware/auth.middleware';
import { Route } from '../types/route.types';
import { App } from '../bootstrap';
import { getBlogController } from '../controller/Blog.controller';

export const blog = (app: App): Route[] => [
    {
        name: 'getBlog',
        path: '/api/blog-news',
        httpMethod: 'get',
        action: getBlogController(app).getBlog,
        guards: [authGuard],
    },
    {
        name: 'getSingleBlog',
        path: '/api/blog-news/:id',
        httpMethod: 'get',
        action: getBlogController(app).getSingleBlog,
        guards: [authGuard],
    },
    {
        name: 'getPublicBlog',
        path: '/api/public/blog-news',
        httpMethod: 'get',
        action: getBlogController(app).getBlog,
        guards: [],
    },
    {
        name: 'getSinglePublicBlog',
        path: '/api/public/blog-news/:id',
        httpMethod: 'get',
        action: getBlogController(app).getSingleBlog,
        guards: [],
    },
    {
        name: 'saveBlog',
        path: '/api/blog-news',
        httpMethod: 'post',
        action: getBlogController(app).saveBlog,
        guards: [authGuard],
    },
    {
        name: 'addBlogTranslation',
        path: '/api/blog-news/translation/:id',
        httpMethod: 'post',
        action: getBlogController(app).addBlogTranslation,
        guards: [authGuard],
    },
    {
        name: 'updateBlog',
        path: '/api/blog-news/translation/:id',
        httpMethod: 'put',
        action: getBlogController(app).updateBlogTranslation,
        guards: [authGuard],
    },
    {
        name: 'publishBlog',
        path: '/api/blog-news/publish/:id',
        httpMethod: 'put',
        action: getBlogController(app).changePublishStatus,
        guards: [authGuard],
    },
    {
        name: 'deleteBlog',
        path: '/api/blog-news/:id',
        httpMethod: 'delete',
        action: getBlogController(app).deleteBlog,
        guards: [authGuard],
    },
];
