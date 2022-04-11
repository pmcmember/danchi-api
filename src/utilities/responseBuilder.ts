import { APIGatewayProxyResult,  } from 'aws-lambda';

type BodyDataTypes<T extends {[key: string]: any} = {
    message: string
}> =  T

const responseBuilder = <T>(statusCode: number, data: BodyDataTypes<T>): APIGatewayProxyResult => {
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