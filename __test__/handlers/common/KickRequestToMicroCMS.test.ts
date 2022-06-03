import { KickRequestToMicroCMSHandler } from "@/handlers/common/KickRequestToMicroCMS";
import {
    BlogsRepositoryMock,
    MusicsRepositoryMock
} from '/__mock__/infrastructure/repositories'
import {
    createAgProxyEvent as createEvent,
    createAgProxyCallback as createCallback,
    createContext
} from '/__test__/__testUtils__';


const context = createContext();
const callback = createCallback();

const handler: KickRequestToMicroCMSHandler = new KickRequestToMicroCMSHandler();
const musicsRepositoryMock = new MusicsRepositoryMock();
const blogsRepositoryMock = new BlogsRepositoryMock();

// set mock classes
handler.musicsRepository = musicsRepositoryMock;
handler.blogsRepository = blogsRepositoryMock;


describe("正常系", () => {
    test("シングルトンであるか", () => {
        const handler1 = new KickRequestToMicroCMSHandler();
        const handler2 = new KickRequestToMicroCMSHandler();

        expect(handler1 === handler2).toBe(true);
    })

    test("リクエストパス:/v1/musics、HTTPメソッド:GET", async () => {
        const event = createEvent({
            path: "/v1/musics",
            httpMethod: "GET"
        });
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, await musicsRepositoryMock.fetchList()))
    })

    test("リクエストパス:/v1/musics/{id}、HTTPメソッド:GET", async () => {
        const id = "testid"
        const event = createEvent({
            path: `/v1/musics/${id}`,
            httpMethod: "GET",
            pathParameters: {
                id: id
            }
        });
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, await musicsRepositoryMock.fetch(id)))
    })

    test("リクエストパス:/v1/blogs、HTTPメソッド:GET", async () => {
        const event = createEvent({
            path: "/v1/blogs",
            httpMethod: "GET"
        });
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, await blogsRepositoryMock.fetchList()))
    })

    test("リクエストパス:/v1/blogs/{id}、HTTPメソッド:GET", async () => {
        const id = "testid"
        const event = createEvent({
            path: `/v1/blogs/${id}`,
            httpMethod: "GET",
            pathParameters: {
                id: id
            }
        });
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, await blogsRepositoryMock.fetch(id)))
    })
})

describe("異常系", () => {
    test("musics、blogs用パス以外にアクセスすると400エラーが返ってくる", async () => {
        const event = createEvent({
            path: `/v1/test`,
            resource: "/v1/test",
            httpMethod: "GET"
        })
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual(handler.agProxyResponseBuilder(400, {message: `Error: invalid Request -> ${event.resource}`}))
    })
})