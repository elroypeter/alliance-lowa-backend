import { IImageSlider } from '../interface/image-slider.interface';
import { ImageSliderRepository } from '../repository/ImageSlider.repository';

export class ImageSliderService {
    imageSlideRepository: ImageSliderRepository;

    constructor(imageSlideRepository: ImageSliderRepository) {
        this.imageSlideRepository = imageSlideRepository;
    }

    async getImageSliders(langCode?: string): Promise<IImageSlider[]> {
        return await this.imageSlideRepository.findLocaleImageSlide(langCode);
    }
}
