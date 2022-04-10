import {
    APIGatewayProxyHandler,
    APIGatewayProxyResult
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';
import { StandardResponse } from '/docs/openapi/src/components/schemas/StandardResponse';

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
        console.log(event);

        return responseBuilder<StandardResponse>(200, {
            message: "OK"
        })
    })
}