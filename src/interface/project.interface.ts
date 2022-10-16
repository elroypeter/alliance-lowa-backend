import { LocaleString } from "../locale/locale-types";
import { IPublishStatus } from "./image-slider.interface";

export interface IProject{
    title: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    attachments: IProjectAttachment[];
    isPublished: IPublishStatus;
}

export interface IProjectAttachment{
    altText: string;
    filePath: string;
    isVideo: boolean;
}