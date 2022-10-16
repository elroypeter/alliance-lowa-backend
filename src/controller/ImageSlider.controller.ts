import { Context, Next } from "koa";
import { ImageSliderEntity } from "../entity/ImageSlider.entity";
import { IImageSlider } from "../interface/image-slider.interface";
import { CreateFile, DeleteFile } from "../services/ManageFile";

class ImageSliderController {
    constructor() {}

    // async getImageSlider(ctx: Context, next: Next) {
    //     const imageSlider: IImageSlider[] = await ImageSliderEntity.find();
    //     ctx.status = 200;
    //     ctx.body = imageSlider;
    // }

    // async getPublishedImageSlider(ctx: Context, next: Next) {
    //     const imageSlider: ImageSlider[] = await ImageSlider.find({
    //         where: { isPublished: true },
    //     });
    //     ctx.status = 200;
    //     ctx.body = imageSlider;
    // }

    // async saveImageSlider(ctx: Context, next: Next) {
    //     const imageSlider: ImageSlider = new ImageSlider();
    //     const { title, image, description } = ctx.request.body;

    //     imageSlider.title = title;
    //     const fileData = await CreateFile(image);
    //     imageSlider.image = fileData.image;
    //     imageSlider.filePath = fileData.filePath;
    //     imageSlider.description = description;

    //     await imageSlider.save();
    //     ctx.body = { message: "saved successfully" };
    //     ctx.status = 200;
    // }

    // async updateImageSlider(ctx: Context, next: Next) {
    //     const imageSlider: ImageSlider = await ImageSlider.findOneBy({
    //         id: ctx.params.id,
    //     });

    //     const { title, image, description } = ctx.request.body;

    //     imageSlider.title = title;
    //     imageSlider.description = description;

    //     if (imageSlider.image !== image) {
    //         await DeleteFile(imageSlider.filePath);
    //         const fileData = await CreateFile(image);
    //         imageSlider.image = fileData.image;
    //         imageSlider.filePath = fileData.filePath;
    //     }

    //     await imageSlider.save();
    //     ctx.body = { message: "updated successfully" };
    //     ctx.status = 200;
    // }

    // async publishImageSlider(ctx: Context, next: Next) {
    //     const imageSlider: ImageSlider = await ImageSlider.findOneBy({
    //         id: ctx.params.id,
    //     });

    //     imageSlider.isPublished = ctx.request.body.status;
    //     await imageSlider.save();
    //     ctx.body = { message: "updated successfully" };
    //     ctx.status = 200;
    // }

    // async deleteImageSlider(ctx: Context, next: Next) {
    //     const imageSlider: ImageSlider = await ImageSlider.findOneBy({
    //         id: ctx.params.id,
    //     });
    //     await DeleteFile(imageSlider.filePath);
    //     await imageSlider.remove();
    //     ctx.body = { message: "removed successfully" };
    //     ctx.status = 200;
    // }
}

export const ImageSliderControllerObj = new ImageSliderController();
