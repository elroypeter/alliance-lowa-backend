import { LocaleString } from "../locale/locale-types";

export interface Career{
    title: string;
    description: string;
}

export interface BlogNews{
    filePath: string;
    imageName: string;
    isPublished: boolean;
    title: LocaleString
    slug: LocaleString;
    description: LocaleString
}