import * as Yaml from "js-yaml";
import * as Path from "path";
import * as fs from "fs";

const config = Yaml.load(
    fs.readFileSync(Path.join(__dirname, "../env.yml"), "utf-8"),
    {
        json: true,
    }
);

if (process.env.NODE_ENV === "production") {
    config.app_port = process.env.PORT;
    config["app_data_source"]["host"] = process.env.DBHOST;
    config["app_data_source"]["port"] = process.env.DBPORT;
    config["app_data_source"]["username"] = process.env.DBUSER;
    config["app_data_source"]["password"] = process.env.DBPASSWORD;
    config["app_data_source"]["database"] = process.env.DBDATABASE;
}

export { config };
