import {
    APIGatewayProxyHandler, APIGatewayProxyResult,
} from 'aws-lambda';
import handlerComUtil from '@/utilities/handlerComUtil';
import { MusicsSongCategoriesRepository } from '@/domain/repositories';
import { MusicsSongCategoriesRepositoryImpl } from '@/infrastructure/repositories';
import { Handler } from '../Handler';
import { Singleton } from '@/decorators';



/**
 * 曲カテゴリ操作関数
 * @param event 
 * @param context 
 * @param _callback 
 */
@Singleton
export class SongCategoriesHandler extends Handler {
    musicsSongCategoriesRepository: MusicsSongCategoriesRepository = new MusicsSongCategoriesRepositoryImpl();

    handler: APIGatewayProxyHandler = async (event, _context, _callback) => {
        const repository = this.musicsSongCategoriesRepository;
        const httpMethod = event.httpMethod.toLowerCase();

        switch(httpMethod) {
            case "get": {
                const result = await repository.fetchList();
        
                return this.agProxyResponseBuilder(200, result);
            }
            case "post": {
                if( ! event.body) {
                    throw new Error("Error: event.body is empty.");
                }
        
                const result = await repository.add(JSON.parse(event.body));
        
                return this.agProxyResponseBuilder(200, result);
            }
            case "delete": {
                if( ! event.queryStringParameters || ! event.queryStringParameters.name) {
                    throw new Error("Error: In delete http method, the name query parameter is required");
                }
                
                const name = event.queryStringParameters.name;
                const data = name.split(",").map((n) => ({
                    name: n
                }))
        
                const result = await repository.delete(data);
        
                return this.agProxyResponseBuilder(200, result);
            }
        
            default: {
                return this.agProxyResponseBuilder(400, `Error: invalid Request -> ${httpMethod}`);
            }
        }
    }
}


export const main: APIGatewayProxyHandler = async (
    event,
    context,
    callback
  ) => {
    return await handlerComUtil(context, async() => {
        const handler = new SongCategoriesHandler();
        const response = handler.handler(event, context, callback);
        return response;
    })
}
