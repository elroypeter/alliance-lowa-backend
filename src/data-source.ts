import { config } from "./config";
import { DataSource } from "typeorm";
import { RegisteredEntities } from "./entity";

export const AppDataSource = new DataSource({
    ...config.app_data_source,
    entities: RegisteredEntities
})