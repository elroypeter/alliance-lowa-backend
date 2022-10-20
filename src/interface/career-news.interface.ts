import { LocaleString } from '../locale/locale-types';
import { IPublishStatus } from './image-slider.interface';

export interface ICareer {
    title: string;
    slug: string;
    description: string;
    isPublished: IPublishStatus;
}

export interface IBlogNews {
    filePath: string;
    isPublished: IPublishStatus;
    title: LocaleString;
    slug: LocaleString;
    description: LocaleString;
}

export interface ICareerDto {
    slug?: string;
    title: string;
    description: LocaleString;
}

export interface IBlogNewsDto {
    base64: string;
    title: string;
    slug?: string;
    langCode: string;
    description: string;
}
