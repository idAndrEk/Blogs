import request from 'supertest'
import {app} from "../../src";
import {HTTP_STATUSES} from "../../src/utils";

describe('Posts API', () => {
    let testPostId: number;
    const username = "admin";
    const password = "qwerty";
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    beforeAll(async () => {
        // Очистка коллекции перед началом тестов
        await request(app).delete('/api/all-data');

        // Создание тестового поста перед началом тестов
        const response = await request(app)
            .post('/posts')
            .set('Authorization', authHeader)
            .send({
                title: 'Test Post',
                shortDescription: 'Test Description',
                content: 'Test Content',
                blogId: 'some-blog-id',
                blogName: 'Some Blog',
            });

        testPostId = response.body.id;
    });

// Тест для получения всех постов
    it('GET /posts should return a list of posts', async () => {
        const response = await request(app).get('/posts');
        expect(response.status).toEqual(HTTP_STATUSES.OK_200);
        expect(response.body).toEqual(expect.any(Array));
    });

    //Тест на получение поста по несуществующему ID
    it('GET /posts/:id should return 404 for non-existent post', async () => {
        const response = await request(app).get('/posts/99999');
        expect(response.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    });

// Тест для получения поста по ID
    it('GET /posts/:id should return a specific post', async () => {
        const response = await request(app).get(`/posts/${testPostId}`);
        expect(response.status).toBe(HTTP_STATUSES.OK_200);
        expect(response.body).toHaveProperty('id', testPostId);
    });
    
//Тест на отсутствие авторизации при создании нового поста
    it('POST /posts should return 401 without authorization', async () => {
        const response = await request(app)
            .post('/posts')
            .send({
                title: 'Unauthorized Test Post',
                shortDescription: 'Unauthorized Test Description',
                content: 'Unauthorized content',
                blogId: 1,
                blogName: 'Test Blog'
            });;

        expect(response.status).toBe(401);
    });

    //Тест на создание поста с неправильными данными
    it('POST /posts should return 400 for missing required fields', async () => {
        const response = await request(app)
            .post('/posts')
            .set('Authorization', authHeader)
            .send({
                // Ошибка
            });

        expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    });

    //Тест на создание поста с неправильными данными
    it('POST /posts should return 400 for invalid blogId format', async () => {
        const response = await request(app)
            .post('/posts')
            .set('Authorization', authHeader)
            .send({
                title: 'Invalid BlogId Test',
                shortDescription: 'Invalid BlogId Description',
                content: 'Invalid BlogId Content',
                blogId: 123,  // ошибка
                blogName: 'Invalid Blog',
            });

        expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    });

    // Тест для создания нового поста
    it('POST /posts should create a new post', async () => {
        const response = await request(app)
            .post('/posts')
            .set('Authorization', authHeader)
            .send({
                title: 'New Test Post',
                shortDescription: 'New Test Short Description',
                content: 'New Test Content',
                blogId: 'some-blog-id',
                blogName: 'Some Blog',
            });

        expect(response.status).toBe(HTTP_STATUSES.CREATED_201);
        expect(response.body).toHaveProperty('title', 'New Test Post');
    });

    //Тест на отсутствие авторизации при обновлении поста
    it('PUT /blogs/:id should return 401 without authorization', async () => {
        const response = await request(app)
            .put(`/blogs/${testPostId}`)
            .send({
                title: 'Updated Test Post',
                shortDescription: 'Updated Test Short Description',
                content: 'Updated Test Content',
                blogId: 'some-blog-id',
                blogName: 'Some Blog',
            });

        expect(response.status).toBe(401);
    });

    //Тест на обновление несуществующего поста
    it('PUT /posts/:id should return 404 for updating non-existent posts', async () => {
        const nonExistentPostId = 99999; // Предполагаемый несуществующий ID поста

        const response = await request(app)
            .put(`/posts/${nonExistentPostId}`)
            .set('Authorization', authHeader)
            .send({
                title: 'Updated Test Post',
                shortDescription: 'Updated Test Short Description',
                content: 'Updated Test Content',
                blogId: 'some-blog-id',
                blogName: 'Some Blog',
            });

        expect(response.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    });

    // Тест для обновления поста
    it('PUT /posts/:id should update a specific blog', async () => {
        const response = await request(app)
            .put(`/posts/${testPostId}`)
            .set('Authorization', authHeader)
            .send({
                title: 'Updated Test Post',
                shortDescription: 'Updated Test Short Description',
                content: 'Updated Test Content',
                blogId: 'updated-blog-id',
                blogName: 'Updated Blog',
            });

        expect(response.status).toBe(HTTP_STATUSES.OK_200);
        expect(response.body).toHaveProperty('title', 'Updated Test Post');
    });

    //Проверка правильности обновления поста
    it('PUT /posts/:id should update a specific post correctly', async () => {
        const updatedPostData = {
            title: 'Updated Test Post',
            shortDescription: 'Updated Test Short Description',
            content: 'Updated Test Content',
            blogId: 'some-blog-id',
            blogName: 'Some Blog',
        };

        const response = await request(app)
            .put(`/posts/${testPostId}`)
            .set('Authorization', authHeader)
            .send(updatedPostData);

        expect(response.status).toBe(HTTP_STATUSES.OK_200);
        expect(response.body).toMatchObject(updatedPostData);
    });

    //Тест на отсутствие авторизации при удалении поста
    it('DELETE /posts/:id should return 401 without authorization', async () => {
        const response = await request(app).delete(`/posts/${testPostId}`);
        expect(response.status).toBe(401);
    });

    //Тест на удаление несуществующего поста
    it('DELETE /posts/:id should return 404 for deleting non-existent blog', async () => {
        const response = await request(app)
            .delete('/posts/99999')
            .set('Authorization', authHeader);

        expect(response.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    });

    // Тест для удаления поста
    it('DELETE /posts/:id should delete a specific blog', async () => {
        const response = await request(app)
            .delete(`/posts/${testPostId}`)
            .set('Authorization', authHeader);

        expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204);

        // Проверяем, что блог действительно удален
        const getResponse = await request(app).get(`/posts/${testPostId}`);
        expect(getResponse.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    });

    afterAll(async () => {
        // Очистка данных после всех тестов
        await request(app).delete('/testing/all-data');

        // Проверка, что данные удалены
        const response = await request(app).get('/posts');
        expect(response.status).toBe(HTTP_STATUSES.OK_200);
        expect(response.body.length).toBe(0);
    });
});
