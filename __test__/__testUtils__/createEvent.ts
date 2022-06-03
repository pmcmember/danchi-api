import {
    APIGatewayProxyEvent,
    APIGatewayAuthorizerEvent,
    APIGatewayTokenAuthorizerEvent,
    APIGatewayRequestAuthorizerEvent
} from 'aws-lambda'

export const createAgProxyEvent = (
    custom?: Partial<APIGatewayProxyEvent>
) => {
    const event: APIGatewayProxyEvent = {
        pathParameters: null,
        queryStringParameters: null,
        body: null,
        headers: {},
        httpMethod: "GET",
        isBase64Encoded: false,
        path: "",
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {
            accountId: "",
            apiId: "",
            authorizer: {},
            protocol: "",
            httpMethod: "",
            path: "",
            stage: "",
            requestId: "",
            requestTimeEpoch: 0,
            resourceId: "",
            resourcePath: "",
            identity: {} as any
        },
        resource: "",
        ...custom
    }

    return event;
}

export const createAgAuthorizerEvent = (
    type: APIGatewayTokenAuthorizerEvent['type'] | APIGatewayRequestAuthorizerEvent['type'], 
    custom?: Partial<APIGatewayAuthorizerEvent>
) => {
    const event: APIGatewayAuthorizerEvent = type === "TOKEN" ?
        {
            type: 'TOKEN',
            methodArn: "",
            authorizationToken: "",
            ...custom
        } as APIGatewayTokenAuthorizerEvent
    :
        {
            type: 'REQUEST',
            methodArn: "",
            resource: "",
            path: "",
            httpMethod: "",
            headers: null,
            multiValueHeaders: null,
            ...custom
        } as APIGatewayRequestAuthorizerEvent

    return event;
}
