import request from 'supertest'
import {app} from "../../src";
import {HTTP_STATUSES} from "../../src/utils/utils";

describe('Blogs API', () => {
    let testBlogId: number;
    const username = "admin";
    const password = "qwerty";
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    beforeAll(async () => {
        // Очистка коллекции перед началом тестов
        await request(app).delete('/api/all-data');

        // Создание тестового блога перед началом тестов
        const response = await request(app)
            .post('/blogs')
            .set('Authorization', authHeader)
            .send({
                name: 'Test Blog',
                description: 'Test Description',
                websiteUrl: 'https://test-blog.ru',
            });

        testBlogId = response.body.id;
    });

// Тест на получения всех блогов
    it('GET /blogs should return a list of blogs', async () => {
        const response = await request(app).get('/blogs');
        expect(response.status).toEqual(HTTP_STATUSES.OK_200);
        expect(response.body).toEqual(expect.any(Array));
    });

    //Тест на получение блога по не правильному формату ID
    it('GET /blogs/:id should return 404 for non-existent blog', async () => {
        const response = await request(app).get('/blogs/111');
        expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    });

    // Тест на получения блога по существующему формату ID, но несуществующему ID
    it('GET /blogs/:id should return 404 for non-existent blog with valid format', async () => {
        const nonExistentBlogId = '60b6ff471d8a5d001f5f1581'; // Предполагаемый несуществующий ID блога

        const response = await request(app).get(`/blogs/${nonExistentBlogId}`);

        expect(response.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    });

// Тест на получения блога по ID
    it('GET /blogs/:id should return a specific blog', async () => {
        const response = await request(app).get(`/blogs/${testBlogId}`);
        expect(response.status).toBe(HTTP_STATUSES.OK_200);
        expect(response.body).toHaveProperty('id', testBlogId);
    });
    
//Тест на отсутствие авторизации при создании нового блога
    it('POST /blogs should return 401 without authorization', async () => {
        const response = await request(app)
            .post('/blogs')
            .send({
                name: 'Unauthorized Test Blog',
                description: 'Unauthorized Test Description',
                websiteUrl: 'https://unauthorized-test-blog.com',
            });

        expect(response.status).toBe(401);
    });

    //Тест на создание блога с неправильными данными
    it('POST /blogs should return 400 for invalid blog data', async () => {
        const response = await request(app)
            .post('/blogs')
            .set('Authorization', authHeader)
            .send({
                name: '',  // Пустое имя
                description: 'Some description',
                websiteUrl: 'invalid-url',  // Некорректный URL
            });

        expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    });

    // Тест на создания нового блога
    it('POST /blogs should create a new blog', async () => {
        const response = await request(app)
            .post('/blogs')
            .set('Authorization', authHeader)
            .send({
                name: 'New Test Blog',
                description: 'New Test Description',
                websiteUrl: 'https://new-test-blog.com',
            });

        expect(response.status).toBe(HTTP_STATUSES.CREATED_201);
        expect(response.body).toHaveProperty('name', 'New Test Blog');
    });

    //Тест на отсутствие авторизации при обновлении блога
    it('PUT /blogs/:id should return 401 without authorization', async () => {
        const response = await request(app)
            .put(`/blogs/${testBlogId}`)
            .send({
                name: 'Unauthorized Updated Blog',
                description: 'Unauthorized Test Description',
                websiteUrl: 'https://unauthorized-updated-test-blog.com',
            });

        expect(response.status).toBe(401);
    });

    //Тест на обновление по не правильному формату ID
    it('PUT /blogs/:id should return 404 for updating non-existent blog', async () => {
        const nonExistentBlogId = 99999; // Предполагаемый несуществующий ID блога

        const response = await request(app)
            .put(`/blogs/${nonExistentBlogId}`)
            .set('Authorization', authHeader)
            .send({
                name: 'Updated Blog', // Обновленные данные блога
                description: 'Updated Test Description',
                websiteUrl: 'https://updated-test-blog.com',
            });

        expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    });

    // Тест на обновления блога
    it('PUT /blogs/:id should update a specific blog', async () => {
        const response = await request(app)
            .put(`/blogs/${testBlogId}`)
            .set('Authorization', authHeader)
            .send({
                name: 'Updated Blog',
                description: 'Updated Test Description',
                websiteUrl: 'https://updated-test-blog.com',
            });

        expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
        // expect(response.body).toHaveProperty('name', 'Updated Blog');
    });

    //Тест на отсутствие авторизации при удалении блога
    it('DELETE /blogs/:id should return 401 without authorization', async () => {
        const response = await request(app).delete(`/blogs/${testBlogId}`);
        expect(response.status).toBe(401);
    });

    //Тест на удаление по не правильному формату ID
    it('DELETE /blogs/:id should return 404 for deleting non-existent blog', async () => {
        const response = await request(app)
            .delete('/blogs/99999')
            .set('Authorization', authHeader);

        expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    });

    // Тест на удаления блога
    it('DELETE /blogs/:id should delete a specific blog', async () => {
        const response = await request(app)
            .delete(`/blogs/${testBlogId}`)
            .set('Authorization', authHeader);

        expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204);

        // Проверяем, что блог действительно удален
        const getResponse = await request(app).get(`/blogs/${testBlogId}`);
        expect(getResponse.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    });

    afterAll(async () => {
        // Очистка данных после всех тестов
        await request(app).delete('/testing/all-data');

        // Проверка, что данные удалены
        const response = await request(app).get('/blogs');
        expect(response.status).toBe(HTTP_STATUSES.OK_200);
        expect(response.body.length).toBe(0);
    });
});


// describe('test for products ', () => {
//     beforeAll(async () => {
//         // Очистка данных перед началом тестов
//         //     await request(app).delete('/products/__test__/data');
//         // });
// //#1 get
//         // Предварительные условия: создание тестовой записи блога
//         let testBlogId: number;
//         // Создание тестового блога перед началом тестов
//         const response = await request(app)
//             .post('/blogs')
//             .set('Authorization', 'Basic YOUR_AUTH_HEADER') // Замените YOUR_AUTH_HEADER на ваш заголовок авторизации
//             .send({
//                 name: 'Test Blog',
//                 description: 'Test Description',
//                 websiteUrl: 'https://test-blog.com',
//             });
//
//         testBlogId = response.body.id;
//     });
// //#2 get
//     it('should return 404 for nor existing products', async () => {
//         await request(app)
//             .get('/products/3')
//             .expect(HTTP_STATUSES.NOT_FOUND_404);
//     });
//     //#3post
//     it('should add a new product', async () => {
//         await request(app)
//             .post('/products')
//             .send({title: 'New Product'})
//             .expect(HTTP_STATUSES.CREATED_201);
//     });
//     //#4
//     // it('shouldn`t create entity with incorrect input data', async () => {
//     //     await request(app)
//     //         .post('/products')
//     //         .send({title: 123})
//     //         .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     //     await request(app)
//     //         .get('/products')
//     //         .expect(HTTP_STATUSES.OK_200, [
//     //             {id: 1, title: 'tomato'},
//     //             {id: 2, title: 'orange'}]);
//     // });
//     //#
//     it('should update a product', async () => {
//         const newProductResponse = await request(app)
//             .post('/products')
//             .send({title: 'Product to Update'});
//
//         const response = await request(app)
//             .put(`/products/${newProductResponse.body.id}`)
//             .send({title: 'Updated Product'});
//
//         expect(response.status).toBe(200);
//     });
//     //#
//     it('should delete a product', async () => {
//         const newProductResponse = await request(app)
//             .post('/products')
//             .send({title: 'Product to Delete'});
//
//         const response = await request(app).delete(`/products/${newProductResponse.body.id}`);
//         expect(HTTP_STATUSES.NO_CONTENT_204);
//     });
//
//     afterAll(async () => {
//         await request(app).delete('/products/__test__/data');
//     });
// });
