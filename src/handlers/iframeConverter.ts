import {
    APIGatewayProxyHandler,
    APIGatewayProxyResult
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';
import { JSDOM } from 'jsdom';

import { IframeConverterRequest } from '/docs/openapi/src/components/schemas/IframeConverterRequest'
import { StandardResponse } from '/docs/openapi/src/components/schemas/StandardResponse';
import { MusicsSchema } from '/docs/openapi/src/components/schemas/MusicsSchema';
import { MicroCMSListContent } from 'microcms-js-sdk'
import { DBService } from '@/utilities/DBService'
import { Base64Util } from '@/utilities/Base64Util';
import axios from 'axios'

// TODO: リファクタ




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
        console.log(event.body)
        
        let response: APIGatewayProxyResult;
        const data: IframeConverterRequest = JSON.parse(event.body);

        if( ! data.contents?.new) {
            throw new Error("Error: Invalid request. Please update the data in MicroCMS and make the request with the webhook setting enabled.")
        }

        const schemaWithContents = (
            data.contents.new.status.includes("DRAFT")? data.contents.new.draftValue
            : data.contents.new.status.includes("PUBLISH")? data.contents.new.publishValue
            : {}
        ) as MusicsSchema & MicroCMSListContent
        
        if(Object.keys(schemaWithContents).length < 0) {
            throw new Error("Error: Invalid request. Please make a DRAFT or PUBLISH request.")
        }
        
        const convertedSchema = convertIframe(schemaWithContents);
        console.log(convertedSchema);
        
        const db = DBService.getInstance();
        const result = await db.get({
            TableName: process.env.MICROCMS_WEBHOOK_CONTENT_NAME || "",
            Key: {
                id: schemaWithContents.id
            }
        })
        
        if(result.isFailure()) {
            throw result.data;
        }
        
        const schema = 
            Object.keys(schemaWithContents).filter((key) => {
                return (
                    key !== "createdAt"
                    && key !== "updatedAt"
                    && key !== "publishedAt"
                    && key !== "revisedAt"
                    && key !== "id" 
                )
            })
            .reduce((pre, crr) => {
                const _crr = crr as keyof MusicsSchema
                return Object.assign(pre, {[_crr]: schemaWithContents[_crr]})
            }, {})
        
        if(result.data.Item?.content !== Base64Util.encode(JSON.stringify(schema))) {
            const endpoint = `${process.env.MICROCMS_API_BASEURL}/${data.api}/${data.id}`;
            console.log(endpoint)
            const res = await axios({
                method: "patch",
                url: endpoint,
                data: convertedSchema,
                headers: {
                    "Content-Type": "application/json",
                    "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
                }
            })
    
            console.log(JSON.stringify(res.data));
            
            await db.put({
                TableName: process.env.MICROCMS_WEBHOOK_CONTENT_NAME || "",
                Item: {
                    id: schemaWithContents.id,
                    content: Base64Util.encode(JSON.stringify(convertedSchema))
                }
            })

            response = responseBuilder(201, {
                message: "update complete"
            })
        } else {
            console.log("更新内容に変化がなかったため、MicroCMSにリクエストを送信しませんでした。")
            response = responseBuilder(200, {
                message: "OK"
            })
        }
        
        return response
    })
}


const convertIframe = <T extends MusicsSchema = MusicsSchema>(data: T): MusicsSchema => {
    const jsdom = new JSDOM(data.iframeRaw);

    const iframe = jsdom.window.document.querySelector("iframe")!;
    const [artistAncor, songAncor] = Array.from(jsdom.window.document.querySelectorAll("a"));

    return {
        iframeRaw: data.iframeRaw,
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