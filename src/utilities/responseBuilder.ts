import { APIGatewayProxyResult } from 'aws-lambda';

type BodyDataTypes = {
    message: string
} & {
    [key: string]: any
}

const responseBuilder = (statusCode: number, data: BodyDataTypes): APIGatewayProxyResult => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "",
            "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
        },
        body: JSON.stringify(data)
    }
}

export default responseBuilder;