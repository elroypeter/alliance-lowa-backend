import * as compose from "koa-compose";

import { subscriber } from "./subscriber";
import { auth } from "./auth";
import { user } from "./user";
import { imageSlider } from "./imageSlider";
import { project } from "./project";

const routes = [...subscriber, ...auth, ...user, ...imageSlider, ...project];

export const Routes = (router) => {
    const config = (route) => {
        router[route["@httpMethod"]](
            route["@path"],
            compose([...route["@guards"], route["@action"]])
        );
    };

    routes.forEach((route) => {
        config(route);
    });
};
