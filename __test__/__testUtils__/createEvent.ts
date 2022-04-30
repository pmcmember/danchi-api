import {
    APIGatewayProxyEvent
} from 'aws-lambda'

export const createEvent = (
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
