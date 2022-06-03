import {
    APIGatewayProxyHandler,
    APIGatewayProxyResult
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';

import { MusicsCmsWebhookRequest } from '@/domain/model/musics/MusicsCmsWebhookRequest'
import { MusicsSchema } from '@/domain/model/musics/MusicsSchema';
import { MicroCMSListContent } from 'microcms-js-sdk'
import { ObjectUtil } from '@/utilities/ObjectUtil';
import container from '@/containers/repositories/MusicsRepository';
import AWS from 'aws-sdk'
import { Failure, Success } from '@/utilities/Result';
import { MusicsSongCategoriesResultList, OEmbedAPIResponse } from '@/domain/model/musics';
import axios from 'axios';
import { Handler } from '../Handler';
import { Singleton } from '@/decorators';


const lambda = new AWS.Lambda();


/**
 * MicroCMSからのWebhookリクエスト処理用クラス
 */
@Singleton
export class CmsWebhookHandler extends Handler {
    handler: APIGatewayProxyHandler = async (event, _context, _callback) => {
        if( ! event.body) {
            throw new Error("Error: event.body must be NOT null or NOT undefined.");
        }

        const data: MusicsCmsWebhookRequest = JSON.parse(event.body);

        if( ! data.contents?.new) {
            throw new Error("Error: Invalid request. Please update the data in MicroCMS and make the request with the webhook setting enabled.")
        }

        const newSchemaWithContents = (
            data.contents.new.status.includes("DRAFT")
                ? data.contents.new.draftValue
                :  data.contents.new.publishValue
        ) as MusicsSchema & MicroCMSListContent
        const oldSchemaWithContents = (
            data.contents.old?.status.includes("DRAFT")
                ? data.contents.old?.draftValue
                :  data.contents.old?.publishValue
        ) as MusicsSchema & MicroCMSListContent | undefined
        
        const newSchema: MusicsSchema = ObjectUtil.removeKeyValue(newSchemaWithContents, ["id", "createdAt", "updatedAt", "publishedAt", "revisedAt"]);
        const oldSchema: MusicsSchema = ObjectUtil.removeKeyValue(oldSchemaWithContents || {}, ["id", "createdAt", "updatedAt", "publishedAt", "revisedAt"]);
        
        if(ObjectUtil.isDifference(newSchema, oldSchema)) {
            const iframeResult = await this.convertIframe(newSchema);

            if( ! iframeResult.scSongHref) {
                throw new Error("Error: convertIframe is failed because MusicSchema['scSongHref'] is undefined.");
            }

            /**
             *  oEmbedからデータフェッチしてサムネイルURL・曲の説明を取得する
             */
            const oEmbedFetchResult = await this.fetchOEmbed(iframeResult.scSongHref);

            
            /**
             * iframeResultとoEmbedFetchResultをマージしたデータをMicroCMSアップデートデータとする
             */
            const cmsUpdateData: MusicsSchema = {
                ...iframeResult,
                scSongDescription: oEmbedFetchResult.description,
                scThumbnailSrc: oEmbedFetchResult.thumbnail_url
            }

            /**
             * MicroCMSデータアップデート
             */
            const repository = container.MusicsRepository;
            await repository.update(data.id!, cmsUpdateData);


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
            await this.updateCategory(newSchema.songCategories)


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
    }

    private convertIframe = async (schema: MusicsSchema): Promise<MusicsSchema> => {
        if( ! process.env.IFRAME_CONVERTER_LAMBDA_NAME) {
            throw new Error("Error: process.env.IFRAME_CONVERTER_LAMBDA_NAME is undefined.")
        }
        
        const result = await this.invokeLambda<MusicsSchema, APIGatewayProxyResult>(
            process.env.IFRAME_CONVERTER_LAMBDA_NAME,
            schema
        )

        if(result.statusCode >= 400) {
            throw new Error(`Invoke lambda "${process.env.IFRAME_CONVERTER_LAMBDA_NAME}" is failed.\nresponse content: ${JSON.stringify(result)}`);
        }
        if( ! result.data) {
            throw new Error(`Incorrect response data structure from ${process.env.IFRAME_CONVERTER_LAMBDA_NAME}.`)
        }
        
        const iframeConvertResult: MusicsSchema = JSON.parse(result.data.body)
        
        return iframeConvertResult
    }

    private fetchOEmbed = async (scSongHref: string): Promise<OEmbedAPIResponse> => {
        const res = await axios({
            method: "get",
            url: `https://soundcloud.com/oembed?url=${scSongHref}&format=json`,
        })
    
        const oEmbedFetchResult: OEmbedAPIResponse = res.data;
    
        return oEmbedFetchResult
    }

    private invokeLambda = async <REQ, RES>(
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

    private updateCategory = async (songCategories: MusicsSchema['songCategories']) => {
        if( ! process.env.SONG_CATEGORIES_LAMBDA_NAME) {
            return new Failure(new Error("Error: process.env.SONG_CATEGORIES_LAMBDA_NAME is undefined."))
        }

        const musicsSongCategories: MusicsSongCategoriesResultList = songCategories!.map((s) => {
            return {
                name: s.songCategory
            }
        })

        const result = await this.invokeLambda<MusicsSongCategoriesResultList, APIGatewayProxyResult>(
            process.env.SONG_CATEGORIES_LAMBDA_NAME,
            musicsSongCategories
        )

        return result.statusCode >= 400
            ? new Failure(new Error(JSON.stringify(result)))
            : new Success("OK")
    }
}

export const main: APIGatewayProxyHandler = async (
    event,
    context,
    callback
  ) => {
    return await handlerComUtil(context, async() => {
        const handler = new CmsWebhookHandler();
        const response = handler.handler(event, context, callback);
        return response;
    })
}

