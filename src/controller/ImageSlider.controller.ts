import { Context, Next } from "koa";
import { ImageSlider } from "../entity/ImageSlider";

class ImageSliderController {
    constructor() {}

    async getImageSlider(ctx: Context, next: Next) {
        const imageSlider: ImageSlider[] = await ImageSlider.find();
        ctx.status = 200;
        ctx.body = imageSlider;
    }

    async saveImageSlider(ctx: Context, next: Next) {
        const imageSlider: ImageSlider = new ImageSlider();
        const { title, image, description } = ctx.request.body;

        imageSlider.title = title;
        imageSlider.image = image;
        imageSlider.description = description;

        await imageSlider.save();
        ctx.body = { subscriber: "saved successfully" };
        ctx.status = 200;
    }

    async updateImageSlider(ctx: Context, next: Next) {
        const imageSlider: ImageSlider = await ImageSlider.findOneBy({
            id: ctx.params.id,
        });

        const { title, image, description } = ctx.request.body;

        imageSlider.title = title;
        imageSlider.image = image;
        imageSlider.description = description;

        await imageSlider.save();
        ctx.body = { imageSlider: "updated successfully" };
        ctx.status = 200;
    }

    async publishImageSlider(ctx: Context, next: Next) {
        const imageSlider: ImageSlider = await ImageSlider.findOneBy({
            id: ctx.params.id,
        });

        imageSlider.isPublished = ctx.request.body.status;
        await imageSlider.save();
        ctx.body = { imageSlider: "updated successfully" };
        ctx.status = 200;
    }

    async deleteImageSlider(ctx: Context, next: Next) {
        const imageSlider: ImageSlider = await ImageSlider.findOneBy({
            id: ctx.params.id,
        });
        await imageSlider.remove();
        ctx.body = { imageSlider: "removed successfully" };
        ctx.status = 200;
    }
}

export const ImageSliderControllerObj = new ImageSliderController();
