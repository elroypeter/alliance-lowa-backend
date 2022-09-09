import { subscriber } from "./subscriber";

const routes = [...subscriber];

export const Routes = (router) => {
    const config = (route) => {
        router[route["@httpMethod"]](route["@path"], route["@action"]);
    };

    routes.forEach((route) => {
        config(route);
    });
};
