import { LocaleString } from "../locale/locale-types";

export interface Project{
    title: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    isPublished: boolean;
    attachments: ProjectAttachment[];
}

export interface ProjectAttachment{
    altText: string;
    filePath: string;
    isVideo: boolean;
}