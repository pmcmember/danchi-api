import {
    APIGatewayProxyHandler,
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';
import container from '@/containers/repositories/MusicsSongCategoriesRepository';



/**
 * 曲カテゴリ操作関数
 * @param event 
 * @param context 
 * @param _callback 
 */

export const main: APIGatewayProxyHandler = async (
    event,
    context,
    _callback
  ) => {
    return await handlerComUtil(context, async() => {
        const repository = container.MusicsSongCategoriesRepository;

        switch(true) {
            case /^get$/i.test(event.httpMethod): {
                const result = await repository.fetchList();

                if(result.isSuccess()) {
                    return responseBuilder(200, result.data);
                } else {
                    throw result.data
                }
            }
            case /^post$/i.test(event.httpMethod): {
                if( ! event.body) {
                    throw new Error("Error: event.body is empty.");
                }

                const result = await repository.add(JSON.parse(event.body));

                if(result.isSuccess()) {
                    return responseBuilder(201, result.data);
                } else {
                    throw result.data
                }
            }
            case /^delete$/i.test(event.httpMethod): {
                if( ! event.queryStringParameters) {
                    throw new Error("Error: event.queryStringParameters is empty.");
                }

                if( ! event.queryStringParameters.name) {
                    throw new Error("Error: event.queryStringParameters.name is empty.");
                }

                const name = event.queryStringParameters.name;
                const data = name.split(",").map((n) => ({
                    name: n
                }))

                const result = await repository.delete(data);

                if(result.isSuccess()) {
                    return responseBuilder(200, result.data);
                } else {
                    throw result.data
                }
            }

            default:
                throw new Error(`Error: invalid Request -> ${event.httpMethod}`)
        }
    })
}
