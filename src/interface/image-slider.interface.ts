import { LocaleString } from '../locale/locale-types';

export interface IImageSlider {
    filePath: string;
    imageName: string;
    title: LocaleString;
    description: LocaleString;
    isPublished: IPublishStatus;
}

export interface IPublishStatus {
    status: boolean;
    entity: string;
}
