import { KickRequestToMicroCMSHandler } from "@/handlers/common/kickRequestToMicroCMS";
import {
    BlogsRepositoryMock,
    MusicsRepositoryMock
} from '/__mock__/infrastructure/repositories'
import {
    createEvent,
    createCallback,
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
    test("リクエストパス:/v1/musics、HTTPメソッド:GET", async () => {
        const event = createEvent({
            path: "/v1/musics",
            httpMethod: "GET"
        });
        console.log(JSON.stringify(event));
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
            },
            body: JSON.stringify(await musicsRepositoryMock.fetchList())
        })
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
        
        expect(result).toStrictEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
            },
            body: JSON.stringify(await musicsRepositoryMock.fetch(id))
        })
    })

    test("リクエストパス:/v1/blogs、HTTPメソッド:GET", async () => {
        const event = createEvent({
            path: "/v1/blogs",
            httpMethod: "GET"
        });
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
            },
            body: JSON.stringify(await blogsRepositoryMock.fetchList())
        })
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
        
        expect(result).toStrictEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
            },
            body: JSON.stringify(await blogsRepositoryMock.fetch(id))
        })
    })
})

describe("正常系", () => {
    test("musics、blogs用パス以外にアクセスすると400エラーが返ってくる", async () => {
        const event = createEvent({
            path: `/v1/test`,
            resource: "/v1/test",
            httpMethod: "GET"
        })
        const result = await handler.handler(event, context, callback);

        expect(result).toStrictEqual({
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
            },
            body: JSON.stringify({
                message: `Error: invalid Request -> ${event.resource}`
            })
        })
    })
})