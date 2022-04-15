import {
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
    APIGatewayProxyEvent,
    Context,
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';

import { MusicsCmsWebhookRequest } from '@/domain/model/musics/MusicsCmsWebhookRequest'
import { MusicsSchema } from '@/domain/model/musics/MusicsSchema';
import { MicroCMSListContent } from 'microcms-js-sdk'
import { ObjectUtil } from '@/utilities/ObjectUtil';
import container from '@/containers/repositories/MusicsRepository';
import AWS from 'aws-sdk'
import { Base64Util } from '@/utilities/Base64Util';
import { Failure, Success } from '@/utilities/Result';
import { MusicsSongCategories, OEmbedAPIResponse } from '@/domain/model/musics';
import axios from 'axios';


const lambda = new AWS.Lambda();


/**
 * MicroCMSからのWebhookリクエスト処理用関数
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
        
        const data: MusicsCmsWebhookRequest = JSON.parse(event.body);

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
            
            /**
             * iframe変換
             */
            const iframeResult = await (async (musicsSchema: MusicsSchema) => {
                try {
                    if( ! process.env.IFRAME_CONVERTER_LAMBDA_NAME) {
                        throw new Error("Error: process.env.IFRAME_CONVERTER_LAMBDA_NAME is undefined.")
                    }
                    
                    const iframeConvertInvokeResult = await invokeLambda<MusicsSchema, APIGatewayProxyResult>(
                        process.env.IFRAME_CONVERTER_LAMBDA_NAME,
                        musicsSchema
                    )
        
                    if(iframeConvertInvokeResult.statusCode >= 400) {
                        throw new Error(`Invoke lambda "${process.env.IFRAME_CONVERTER_LAMBDA_NAME}" is failed.\nresponse content: ${JSON.stringify(iframeConvertInvokeResult)}`);
                    }
                    if( ! iframeConvertInvokeResult.data) {
                        throw new Error(`Incorrect response data structure from ${process.env.IFRAME_CONVERTER_LAMBDA_NAME}.`)
                    }
                    
                    const iframeConvertResult: MusicsSchema = JSON.parse(iframeConvertInvokeResult.data.body)
                    
                    return new Success(iframeConvertResult)

                } catch(e) {
                    return new Failure(e as Error);
                }
            })(newSchema)

            if(iframeResult.isFailure()) {
                console.error("Convert iframe contents is failed.");
                console.error(JSON.stringify(iframeResult.data))
                
                throw iframeResult.data
            }

            /**
             *  oEmbedからデータフェッチしてサムネイルURL・曲の説明を取得する
             */
            const oEmbedFetchResult = await (async (scSongHref: string | undefined) => {
                try {
                    if( ! scSongHref) {
                        throw new Error("Error: convertIframe is failed because MusicSchema['scSongHref'] is undefined.");
                    }
    
                    const fetchOEmbed = async (scSongHref: string): Promise<OEmbedAPIResponse> => {
                        const res = await axios({
                            method: "get",
                            url: `https://soundcloud.com/oembed?url=${scSongHref}&format=json`,
                        })
                    
                        const oEmbedFetchResult: OEmbedAPIResponse = res.data;
                    
                        return oEmbedFetchResult
                    }
    
    
                    const oEmbedFetchResult = await fetchOEmbed(scSongHref);
    
                    
                    return new Success(oEmbedFetchResult);
                } catch(e) {
                    return new Failure(e as Error)
                }
            })(iframeResult.data.scSongHref)
            
            if(oEmbedFetchResult.isFailure()) {
                console.error(" is failed.");
                console.error(JSON.stringify(oEmbedFetchResult.data))
                
                throw oEmbedFetchResult.data
            }

            
            /**
             * iframeResultとoEmbedFetchResultをマージしたデータをMicroCMSアップデートデータとする
             */
            const cmsUpdateData: MusicsSchema = {
                ...iframeResult.data,
                scSongDescription: oEmbedFetchResult.data.description,
                scThumbnailSrc: oEmbedFetchResult.data.thumbnail_url
            }

            /**
             * MicroCMSデータアップデート
             */
            const cmsUpdateResult = await (async (id: string, data: MusicsSchema) => {
                try {
                    const repository = container.MusicsRepository;
                    const result = await repository.update(id, data);
        
                    return result
                } catch(e) {
                    return new Failure(e as Error)
                }
            })(data.id!, cmsUpdateData);
            
            if(cmsUpdateResult.isFailure()) {
                console.error("Update MicroCMS musics data is failed.");
                console.error(JSON.stringify(cmsUpdateResult.data))
                
                throw cmsUpdateResult.data
            }


            if( ! newSchema.songCategories) {
                const message = "musics update: OK.\nsongCategory update: Processing was skipped because the request did not exist."
                console.log(message)
                return responseBuilder(201, {
                    message: message
                })
            }
        
            /**
             * カテゴリ一覧の更新
             */
            const songCategoriesResult = await (async (categories: MusicsSchema["songCategories"]) => {
                if( ! process.env.SONG_CATEGORIES_LAMBDA_NAME) {
                    return new Failure(new Error("Error: process.env.SONG_CATEGORIES_LAMBDA_NAME is undefined."))
                }

                try {
                    const songCategories = newSchema.songCategories!.map((s) => {
                        return {
                            name: s.songCategory
                        }
                    })
    
                    const result = await invokeLambda<MusicsSongCategories, APIGatewayProxyResult>(
                        process.env.SONG_CATEGORIES_LAMBDA_NAME,
                        songCategories
                    )

                    return result.statusCode >= 400 ?
                        new Failure(new Error(JSON.stringify(result)))
                        : new Success("OK")
                } catch(e) {
                    return new Failure(e as Error);
                }
            })(cmsUpdateData.songCategories!)

            if(songCategoriesResult.isFailure()) {
                console.error("Update song categories data is failed.");
                console.error(JSON.stringify(songCategoriesResult.data));

                throw iframeResult.data;
            }


            console.log("all ok.");
            return responseBuilder(201, {
                message: "musics update: OK.\nsongCategory update: OK."
            })
        } else {
            console.log("更新内容に変化がなかったため、MicroCMSにリクエストを送信しませんでした。")
            console.log("old", JSON.stringify(oldSchema))
            console.log("new", JSON.stringify(newSchema))
            return responseBuilder(200, {
                message: "OK"
            })
        }
    })
}


const invokeLambda = async <REQ, RES>(
    functionName: string,
    request: REQ
): Promise<{data: RES, statusCode: number }> => {
    const event = {
        body: JSON.stringify(request),
        httpMethod: "POST"
    }

    const invokeResult = await lambda.invoke({
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        // ClientContext: Base64Util.encode(JSON.stringify(context)),
        Payload: JSON.stringify(event)
    }).promise()

    if( ! invokeResult.Payload) {
        throw new Error(`Error: The response from ${functionName} was not returned correctly.`)
    }

    return {
        data: JSON.parse(invokeResult.Payload.toString()),
        statusCode: invokeResult.StatusCode || 200
    }
}