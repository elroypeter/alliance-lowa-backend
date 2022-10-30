import * as Yaml from 'js-yaml';
import * as Path from 'path';
import * as fs from 'fs';

// read env file
export const configService = (entities?: any, envFile?: string): Record<string, any> => {
    const config: Record<string, any> = Yaml.load(
        fs.readFileSync(Path.join(__dirname, envFile || (process.env.NODE_ENV === 'production' ? '../env.prod.yml' : '../env.yml')), 'utf-8'),
        {
            json: true,
        },
    );

    config['app_data_source']['entities'] = entities;

    // update prod envs
    if (process.env.NODE_ENV === 'production') {
        config.app_port = process.env.PORT;
        config.jwt_secret = process.env.JWTSECRET;
        config['app_data_source']['host'] = process.env.DBHOST;
        config['app_data_source']['port'] = process.env.DBPORT;
        config['app_data_source']['username'] = process.env.DBUSER;
        config['app_data_source']['password'] = process.env.DBPASSWORD;
        config['app_data_source']['database'] = process.env.DBDATABASE;
    }

    return config;
};
