import { ImageSliderControllerObj as ImageSliderController } from "../controller/ImageSlider.controller";
import { authGuard } from "../middleware/auth.middleware";

/**
 * routes format
 *     {
 *       "@name": "route name",
 *       "@path": "/path_url",
 *       "@httpMethod": "get|post|put|patch|delete",
 *       "@action": controller method,
 *       "@guards": [middlewares and generators],
 *    }
 */
export const imageSlider = [
    {
        "@name": "getImageSlider",
        "@path": "/image-slider",
        "@httpMethod": "get",
        "@action": ImageSliderController.getImageSlider,
        "@guards": [authGuard],
    },
    {
        "@name": "saveImageSlider",
        "@path": "/image-slider",
        "@httpMethod": "post",
        "@action": ImageSliderController.saveImageSlider,
        "@guards": [authGuard],
    },
    {
        "@name": "updateImageSlider",
        "@path": "/image-slider/:id",
        "@httpMethod": "put",
        "@action": ImageSliderController.updateImageSlider,
        "@guards": [authGuard],
    },
    {
        "@name": "publishImageSlider",
        "@path": "/image-slider/publish/:id",
        "@httpMethod": "put",
        "@action": ImageSliderController.publishImageSlider,
        "@guards": [authGuard],
    },
    {
        "@name": "deleteImageSlider",
        "@path": "/image-slider/:id",
        "@httpMethod": "delete",
        "@action": ImageSliderController.deleteImageSlider,
        "@guards": [authGuard],
    },
    {
        "@name": "getWebImageSlider",
        "@path": "/website/image-slider",
        "@httpMethod": "get",
        "@action": ImageSliderController.getPublishedImageSlider,
        "@guards": [],
    },
];
