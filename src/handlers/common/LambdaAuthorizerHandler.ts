import {
    APIGatewayAuthorizerHandler,
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult
} from 'aws-lambda';
import { Handler } from '../Handler';
import { Singleton } from '@/decorators'


/**
 * ラムダ認証処理
 * @param event 
 * @param _context 
 * @param _callback 
 */
@Singleton
export class LambdaAuthorizerHandler extends Handler {
    private readonly authHeaderKey = "X-Custom-Authorization";

    handler: APIGatewayAuthorizerHandler = async (event, _context, _callback) => {
        try {
            const token = this.getTokenStoredInEvent(event);

            // Authorizationヘッダーから取っている関係でbearer文字列があるため除去する
            const tokenValue = token.replace(/^([b,B]earer|[b,B]asic) /, "")
            
            const effect = tokenValue === process.env.AUTHORIZATION_KEY
                ? "Allow"
                : "Deny";
    
            return this.agAuthorizerResponseBuilder(event, effect);
        } catch(e) {
            console.error(e);
            return this.agAuthorizerResponseBuilder(event, "Deny");
        }
    }

    private getTokenStoredInEvent = (event: APIGatewayAuthorizerEvent): string => {        
        switch(event.type) {
            case "REQUEST":
                // authHeaderKeyキーの存在確認
                // ツールによっては小文字に変換されてしまうため、大小関係なくキーを検索し、
                // 条件に合ったキー名を取得する
                const result = Object.keys(event.headers || {}).find((key) => {
                    return key.toLowerCase() === this.authHeaderKey.toLowerCase()
                })
    
                if( ! result) {
                    throw new Error("Error: Valid authentication header does not exist")
                } else {
                    return event.headers![result]!
                }
            case "TOKEN":
                return event.authorizationToken
        }
    }

    public getAuthHeaderKey = () => {
        return this.authHeaderKey
    }
}



export const main: APIGatewayAuthorizerHandler = async (
    event,
    context,
    callback
) => {
    const handler = new LambdaAuthorizerHandler();
    const response = await handler.handler(event, context, callback);
    return response as APIGatewayAuthorizerResult
}