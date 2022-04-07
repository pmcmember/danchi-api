import {
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
    APIGatewayProxyEvent,
    Context,
    Callback
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder'


/**
 * メール送信処理の前段用ヘルスチェック
 * @param _event 
 * @param _context 
 * @param callback 
 */

export const main: APIGatewayProxyHandler = async (
    _event: APIGatewayProxyEvent,
    context: Context,
    _callback: Callback<APIGatewayProxyResult>
  ): Promise<APIGatewayProxyResult> => {
    return responseBuilder(200, {message: "OK"});
}