import { SongCategoriesHandler } from "@/handlers/musics/SongCategories";
import {
    createAgProxyCallback as createCallback,
    createContext,
    createAgProxyEvent as createEvent
} from '/__test__/__testUtils__';
import { MusicsSongCategoriesRepositoryMock } from '/__mock__/infrastructure/repositories'

const handler = new SongCategoriesHandler();
const musicsSongCategoriesRepositoryMock = new MusicsSongCategoriesRepositoryMock()

handler.musicsSongCategoriesRepository = musicsSongCategoriesRepositoryMock

const context = createContext();
const callback = createCallback();

describe("正常系", () => {
    test("シングルトンであること", () => {
        const handler1 = new SongCategoriesHandler();
        const handler2 = new SongCategoriesHandler();

        expect(handler1 === handler2).toBe(true);
    })
   
    test("getリクエストを受けたら曲カテゴリリストが返ってくること", async () => {
        const httpMethod = "get"
        const event = createEvent({
            httpMethod: httpMethod
        })
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, await musicsSongCategoriesRepositoryMock.fetchList()))
    })

    test("postリクエストを受けたら追加リクエストを受けたカテゴリを含んだ曲カテゴリリストが返ってくること", async () => {
        const httpMethod = "post"
        // 追加するカテゴリ
        const data = [
            {
                name: "カテゴリ3"
            },
            {
                name: "カテゴリ4"
            }
        ]
        const event = createEvent({
            httpMethod: httpMethod,
            body: JSON.stringify(data)
        })
        const result = await handler.handler(event, context, callback);
        
        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, await musicsSongCategoriesRepositoryMock.add(data)))
    })

    test("deleteリクエストを受けたら削除リクエストを受けたカテゴリを含まない曲カテゴリリストが返ってくること", async () => {
        const httpMethod = "delete"
        // 削除するカテゴリ
        const data = [
            {
                name: "カテゴリ1"
            },
            {
                name: "カテゴリ2"
            }
        ]
        const event = createEvent({
            httpMethod: httpMethod,
            queryStringParameters: {
                name: "カテゴリ1,カテゴリ2"
            }
        })
        const result = await handler.handler(event, context, callback);

        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, await musicsSongCategoriesRepositoryMock.delete(data)))
    })
})

describe("異常系", () => {
    test("patchリクエストを受けたら400が返ってくる", async () => {
        const httpMethod = "patch"
        const event = createEvent({
            httpMethod: httpMethod
        });
        const result = await handler.handler(event, context, callback);

        expect(result).toStrictEqual(handler.agProxyResponseBuilder(400, `Error: invalid Request -> ${event.httpMethod}`))
    })

    test("putリクエストを受けたら400が返ってくる", async () => {
        const httpMethod = "put"
        const event = createEvent({
            httpMethod: httpMethod
        });
        const result = await handler.handler(event, context, callback);

        expect(result).toStrictEqual(handler.agProxyResponseBuilder(400, `Error: invalid Request -> ${event.httpMethod}`))
    })
})