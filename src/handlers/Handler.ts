import {
    APIGatewayAuthorizerHandler,
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';


type BodyDataTypes<T extends {[key: string]: any} = {
    message: string
}> =  T

export abstract class Handler {
    abstract handler: APIGatewayProxyHandler | APIGatewayAuthorizerHandler
    
    protected proxyResponseBuilder = <T>(
        statusCode: number,
        data: BodyDataTypes<T>
    ): APIGatewayProxyResult => {
        return {
            statusCode: statusCode,
            headers: {
                "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
            },
            body: JSON.stringify(data)
        }
    }

    protected authorizerResponseBuilder = (
        event: APIGatewayAuthorizerEvent,
        effect: "Allow" | "Deny"
    ): APIGatewayAuthorizerResult => {
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
}
