import { LocaleString } from "../locale/locale-types";
import { IPublishStatus } from "./image-slider.interface";

export interface ICareer{
    title: string;
    description: string;
}

export interface IBlogNews{
    filePath: string;
    imageName: string;
    isPublished: IPublishStatus;
    title: LocaleString
    slug: LocaleString;
    description: LocaleString
}