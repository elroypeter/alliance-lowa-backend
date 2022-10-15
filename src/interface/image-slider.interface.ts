import { LocaleString } from "../locale/locale-types";

export interface ImageSlider{
    filePath: string;
    imageName: string;
    title: LocaleString;
    description: LocaleString;
    isPublished: boolean;
}