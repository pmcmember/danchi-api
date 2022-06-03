import { APIGatewayAuthorizerCallback, APIGatewayProxyCallback } from "aws-lambda";

export const createAgProxyCallback = (): APIGatewayProxyCallback => {
    return () => undefined;
}

export const createAgAuthorizerCallback = (): APIGatewayAuthorizerCallback => {
    return () => undefined;
}