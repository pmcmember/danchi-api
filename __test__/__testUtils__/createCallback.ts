import { APIGatewayProxyCallback } from "aws-lambda";

export const createCallback = (): APIGatewayProxyCallback => {
    return () => undefined;
}