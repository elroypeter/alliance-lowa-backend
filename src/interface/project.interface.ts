import { LocaleString } from '../locale/locale-types';
import { IPublishStatus } from './image-slider.interface';

export interface IProject {
    title: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    attachments: IProjectAttachment[];
    isPublished: IPublishStatus;
}

export interface IProjectDto {
    slug?: string;
    langCode: string;
    title: LocaleString;
    description: LocaleString;
}

export interface IProjectAttachment {
    filePath: string;
    isVideo: boolean;
}

export interface IProjectAttachmentDto {
    base64: string;
    isVideo: boolean;
}
