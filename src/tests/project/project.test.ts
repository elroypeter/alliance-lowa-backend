import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { ProjectTranslationEntity } from '../../entity/ProjectTranslationEntity.entity';
import { ProjectEntity } from '../../entity/Project.entity';
import { DeleteFile } from '../../services/ManageFile.service';

describe('Project tests', () => {
    let token;
    let selectedProject;
    let attachment;

    beforeAll(async () => {
        const email = 'test@gmail.com';
        const password = 'test';
        const hashPassword = await bcrypt.hash(password, 10);

        const user = UserEntity.create({
            email,
            password: hashPassword,
            name: 'John',
        });
        await user.save();

        const loginResponse = await Request(TestApp.koaInstance.callback()).post('/auth/login').send({ email: 'test@gmail.com', password: 'test' });
        expect(loginResponse.status).toEqual(ResponseCode.OK);
        expect(loginResponse.body.token).toBeDefined();
        token = loginResponse.body.token;
    });

    it('authenticated access of project', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/project').set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('save new project', async () => {
        const newProject = {
            langCode: 'en',
            title: 'en Alliance Lowa',
            description: 'en Show activity on this post',
        };

        const response = await Request(TestApp.koaInstance.callback()).post('/api/project').set('token', token).send(newProject);
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        selectedProject = response.body[0];
        expect(selectedProject.isPublished.status).toBeFalsy();
    });

    it('access project with true isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/project').query({ isPublished: true }).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
    });

    it('access project with false isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/project').query({ isPublished: false }).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
    });

    it('access public endpoint project with true isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/public/project').query({ isPublished: true });
        expect(response.status).toEqual(ResponseCode.OK);
    });

    it('add project translation', async () => {
        const newTranslation = {
            langCode: 'de',
            title: 'de Alliance Lowa',
            description: 'de Show activity on this post',
        };
        const response = await Request(TestApp.koaInstance.callback())
            .post(`/api/project/translation/${selectedProject.id}`)
            .set('token', token)
            .send(newTranslation);
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body.translations).toBeInstanceOf(Array);
        expect(response.body.translations.length).toBeGreaterThan(1);
    });

    it('fetch single project', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get(`/api/project/${selectedProject.id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body.id).toEqual(selectedProject.id);
    });

    it('fetch public single project', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get(`/api/public/project/${selectedProject.id}`).query({ langCode: 'de' });
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body.langCode).toEqual('de');
        expect(response.body.title).toEqual('de Alliance Lowa');
    });

    it('update project translation', async () => {
        const updateTranslation = {
            title: 'Updated Alliance Lowa',
            description: 'Show activity on this post',
        };

        const response = await Request(TestApp.koaInstance.callback())
            .put(`/api/project/translation/${selectedProject.translations[0].id}`)
            .set('token', token)
            .send(updateTranslation);
        expect(response.status).toEqual(ResponseCode.CREATED);
        const updatedProjectTranslation = await ProjectTranslationEntity.findOne({ where: { id: response.body.id } });
        expect(updatedProjectTranslation.title).toEqual('Updated Alliance Lowa');
    });

    it('add project attachment', async () => {
        const projectAttachment = {
            isVideo: false,
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
        };

        const response = await Request(TestApp.koaInstance.callback())
            .post(`/api/project/attachment/${selectedProject.id}`)
            .set('token', token)
            .send(projectAttachment);
        attachment = response.body.attachments[0];
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body.attachments.length).toBeGreaterThan(0);
        await DeleteFile(attachment.filePath);
    });

    it('delete project attachment', async () => {
        const response = await Request(TestApp.koaInstance.callback()).delete(`/api/project/attachment/${attachment.id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        const project = await ProjectEntity.findOne({ where: { id: selectedProject.id }, relations: ['attachments'] });
        expect(project.attachments.length).toEqual(0);
    });

    it('publish project', async () => {
        const response = await Request(TestApp.koaInstance.callback()).put(`/api/project/publish/${selectedProject.id}`).set('token', token).send({
            status: true,
        });
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const publishedProject = await ProjectEntity.findOne({ where: { id: response.body.id }, relations: ['isPublished'] });
        expect(publishedProject.isPublished.status).toBeTruthy();
    });

    it('access public endpoint project with true isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/public/project').query({ isPublished: true });
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toEqual(1);
    });

    it('delete project', async () => {
        const response = await Request(TestApp.koaInstance.callback()).delete(`/api/project/${selectedProject.id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const deletedProject = await ProjectEntity.findOne({ where: { id: response.body.id } });
        expect(deletedProject).toBeNull();
    });
});
