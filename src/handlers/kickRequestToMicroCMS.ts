import {
    APIGatewayProxyEvent,
    APIGatewayProxyHandler,
    APIGatewayProxyResult
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';
import { StandardResponse } from '@/domain/model/common/StandardResponse';
import axios from 'axios';
import { MusicsRepositoryImpl, BlogsRepositoryImpl } from '@/infrastructure/repositories';



/**
 * メール送信処理の前段用ヘルスチェック
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
        const apiId = event.path.split("/")[2];
        const id = event.pathParameters?.id;

        switch(apiId) {
            case "musics": {
                const repository = new MusicsRepositoryImpl()
                
                const result = id ?
                    await repository.fetch(event.pathParameters?.id || "")
                :
                    await repository.fetchList()
                
                if(result.isSuccess()) {
                    return responseBuilder(200, result.data)
                } else {
                    throw result.data;
                }
            }
            case "blogs": {
                const repository = new BlogsRepositoryImpl()
                
                const result = id ?
                    await repository.fetch(event.pathParameters?.id || "")
                :
                    await repository.fetchList()
                
                if(result.isSuccess()) {
                    return responseBuilder(200, result.data)
                } else {
                    throw result.data;
                }
            }
            default:
                throw new Error(`Error: invalid Request -> ${event.resource}`)
        }
    })
}


const router = <T extends {[key: string]: any}>(
    event: APIGatewayProxyEvent,
    path: string,
    controller: (event: APIGatewayProxyEvent) => T
) => {
    const response = 
        event.resource === path?
            responseBuilder<T>(200, controller(event))
        :
            responseBuilder
}