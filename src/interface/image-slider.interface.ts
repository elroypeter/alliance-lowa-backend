import { LocaleString } from '../locale/locale-types';

export interface IImageSlider {
    filePath: string;
    title: LocaleString;
    description: LocaleString;
    isPublished: IPublishStatus | boolean;
}

export interface IImageSliderDto {
    langCode?: string;
    base64?: string;
    title: string;
    description: string;
}

export interface IPublishStatus {
    status: boolean;
    entity: string;
}
