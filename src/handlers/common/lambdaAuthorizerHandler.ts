import {
    APIGatewayAuthorizerHandler,
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult,
    Context,
    Callback
} from 'aws-lambda';


/**
 * ラムダ認証処理
 * @param event 
 * @param _context 
 * @param _callback 
 */

export const main: APIGatewayAuthorizerHandler = async (
    event: APIGatewayAuthorizerEvent,
    _context: Context,
    _callback: Callback<APIGatewayAuthorizerResult>
  ): Promise<APIGatewayAuthorizerResult> => {
    let token: string | undefined;
    let response: APIGatewayAuthorizerResult;

    switch(event.type) {
        case "REQUEST":
            // "X-Custom-Authorization"キーの存在確認
            // ツールによっては小文字に変換されてしまうため、大小関係なくキーを検索し、
            // 条件に合ったキー名を取得する
            const [result] = Object.keys(event.headers || {}).filter((key) => {
                return key.toLowerCase() === "X-Custom-Authorization".toLowerCase()
            })

            token = event.headers?.[result]
            break;
        case "TOKEN":
            token = event.authorizationToken
            break;
    }

    
    try {
        if( ! token) {
            throw new Error(`[ERROR]No token was set. request type = ${event.type}`)
        }
        
        // Authorizationヘッダーから取っている関係でbearer文字列があるため除去する
        const tokenValue = token.replace(/^([b,B]earer|[b,B]asic) /, "")
        
        const effect = tokenValue === process.env.AUTHORIZATION_KEY? "Allow": "Deny";

        response = authorizerResponseBuilder(event, effect);
    } catch(e) {
        console.error(e);
        response = authorizerResponseBuilder(event, "Deny");
    }

    return response;
}



const authorizerResponseBuilder = (event: APIGatewayAuthorizerEvent, effect: "Allow" | "Deny"): APIGatewayAuthorizerResult => {
    return {
        "principalId": "*",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": event.methodArn
                }
            ]
        }
    }
}
