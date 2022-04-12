import {
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';
import { JSDOM } from 'jsdom';

import { MusicsIframeConverterRequest } from '@/domain/model/musics/MusicsIframeConverterRequest'
import { MusicsSchema } from '@/domain/model/musics/MusicsSchema';
import { MicroCMSListContent } from 'microcms-js-sdk'
import { ObjectUtil } from '@/utilities/ObjectUtil';
import { MusicsRepositoryImpl } from '@/infrastructure/repositories/MusicsRepository';


/**
 * Iframe変換
 * @param event 
 * @param context 
 * @param _callback 
 */

export const main: APIGatewayProxyHandler = async (
    event,
    context,
    _callback
  ) => {
    return await handlerComUtil(context, async() => {
        if( ! event.body) {
            throw new Error("Error: event.body must be NOT null or NOT undefined.");
        }
        
        let response: APIGatewayProxyResult;
        const data: MusicsIframeConverterRequest = JSON.parse(event.body);

        if( ! data.contents?.new) {
            throw new Error("Error: Invalid request. Please update the data in MicroCMS and make the request with the webhook setting enabled.")
        }

        const newSchemaWithContents = (
            data.contents.new.status.includes("DRAFT")? data.contents.new.draftValue
            :  data.contents.new.publishValue
        ) as MusicsSchema & MicroCMSListContent
        const oldSchemaWithContents = (
            data.contents.old?.status.includes("DRAFT")? data.contents.old?.draftValue
            :  data.contents.old?.publishValue
        ) as MusicsSchema & MicroCMSListContent | undefined
        
        const newSchema: MusicsSchema = ObjectUtil.removeKeyValue(newSchemaWithContents, ["id", "createdAt", "updatedAt", "publishedAt", "revisedAt"]);
        const oldSchema: MusicsSchema = ObjectUtil.removeKeyValue(oldSchemaWithContents || {}, ["id", "createdAt", "updatedAt", "publishedAt", "revisedAt"]);
        
        if(ObjectUtil.isDifference(newSchema, oldSchema)) {
            const repository = new MusicsRepositoryImpl();
            const convertedSchema = convertIframe(newSchema);
            const result = await repository.update(data.id!, convertedSchema);
            
            console.log(JSON.stringify(convertedSchema));
    
            response = result.isSuccess() ?
                responseBuilder(201, {
                    message: "update complete"
                })
            :
                responseBuilder(500, {
                    message: "update is failed"
                })
        } else {
            console.log("更新内容に変化がなかったため、MicroCMSにリクエストを送信しませんでした。")
            console.log("old", JSON.stringify(oldSchema))
            console.log("new", JSON.stringify(newSchema))
            response = responseBuilder(200, {
                message: "OK"
            })
        }
        
        return response
    })
}


const convertIframe = (musicsSchema: MusicsSchema): MusicsSchema => {
    const jsdom = new JSDOM(musicsSchema.rawIframe);

    const iframe = jsdom.window.document.querySelector("iframe")!;
    const [artistAncor, songAncor] = Array.from(jsdom.window.document.querySelectorAll("a"));

    return {
        ...musicsSchema,
        scSrc: iframe.src,
        scArtistName: artistAncor.title,
        scArtistHref: artistAncor.href,
        scSongTitle: songAncor.title,
        scSongHref: songAncor.href,
        scApiUrl: decodeURIComponent(
            iframe.src
            .split("?").filter((v) => v.match(/^url=.*$/))[0]
            .split("&")[0]
            .split("=")[1]
        )
    }
}