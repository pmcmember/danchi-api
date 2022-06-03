import { MusicsSchema } from "@/domain/model/musics";
import { IframeConverterHandler } from "@/handlers/musics/IframeConverter";
import {
    createAgProxyEvent as createEvent,
    createAgProxyCallback as createCallback,
    createContext
} from '/__test__/__testUtils__'

const handler = new IframeConverterHandler();

const callback = createCallback();
const context = createContext();


const sampleData: MusicsSchema = {
    rawIframe: "<iframe width=\"100%\" height=\"166\" scrolling=\"no\" frameborder=\"no\" allow=\"autoplay\" src=\"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1231793908&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true\"></iframe><div style=\"font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;\"><a href=\"https://soundcloud.com/danchi-bgm\" title=\"DANCHi(BGM提供部)\" target=\"_blank\" style=\"color: #cccccc; text-decoration: none;\">DANCHi(BGM提供部)</a> · <a href=\"https://soundcloud.com/danchi-bgm/futto\" title=\"FUTTO\" target=\"_blank\" style=\"color: #cccccc; text-decoration: none;\">FUTTO</a></div>",
    songCategories: [
        {
            fieldId: "songCategory",
            songCategory: "かっこいい"
        },
        {
            fieldId: "songCategory",
            songCategory: "おしゃれ"
        }
    ]
}

const convertedSampleData: MusicsSchema = {
    rawIframe: "<iframe width=\"100%\" height=\"166\" scrolling=\"no\" frameborder=\"no\" allow=\"autoplay\" src=\"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1231793908&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true\"></iframe><div style=\"font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;\"><a href=\"https://soundcloud.com/danchi-bgm\" title=\"DANCHi(BGM提供部)\" target=\"_blank\" style=\"color: #cccccc; text-decoration: none;\">DANCHi(BGM提供部)</a> · <a href=\"https://soundcloud.com/danchi-bgm/futto\" title=\"FUTTO\" target=\"_blank\" style=\"color: #cccccc; text-decoration: none;\">FUTTO</a></div>",
    songCategories: [
        {
            fieldId: "songCategory",
            songCategory: "かっこいい"
        },
        {
            fieldId: "songCategory",
            songCategory: "おしゃれ"
        }
    ],
    scSrc: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1231793908&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    scArtistName: "DANCHi(BGM提供部)",
    scArtistHref: "https://soundcloud.com/danchi-bgm",
    scSongTitle: "FUTTO",
    scSongHref: "https://soundcloud.com/danchi-bgm/futto",
    scApiUrl: "https://api.soundcloud.com/tracks/1231793908"
}



describe("正常系", () => {
    test("データが変換されて返ってくること", async () => {
        const event = createEvent({
            body: JSON.stringify(sampleData)
        })
        const result = await handler.handler(event, context, callback);

        expect(result).toStrictEqual(handler.agProxyResponseBuilder(200, convertedSampleData))
    })
})

describe("異常系", () => {
    test("eventにbodyプロパティがない", async () => {
        const event = createEvent();

        expect(handler.handler(event, context, callback))
            .rejects
            .toThrowError();
    })

    test("event.bodyがMusicsSchemaでない", async () => {
        const event = createEvent({
            body: JSON.stringify({
                test: "test"
            })
        })

        expect(handler.handler(event, context, callback))
            .rejects
            .toThrowError();
    })
})