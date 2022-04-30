import {
    APIGatewayProxyHandler, APIGatewayProxyResult,
} from 'aws-lambda';
import handlerComUtil from '@/utilities/handlerComUtil';
import { BlogsRepository, MusicsRepository } from '@/domain/repositories';
import { BlogsRepositoryImpl, MusicsRepositoryImpl } from '@/infrastructure/repositories';
import { Handler } from '@/handlers/Handler';
import { Singleton } from '@/decorators';
import {
    MusicsResult,
    MusicsResultList
} from '@/domain/model/musics';
import {
    BlogsResult,
    BlogsResultList
} from '@/domain/model/blogs';


/**
 * MicroCMS APIにリクエストをキックするクラス
 */
@Singleton
export class KickRequestToMicroCMSHandler extends Handler {
    musicsRepository: MusicsRepository = new MusicsRepositoryImpl();
    blogsRepository: BlogsRepository = new BlogsRepositoryImpl();

    /**
     * アクセスされたパスに応じて実行するメソッドを切り替えるメソッド
     * @param event 
     * @param _context 
     * @param _callback 
     * @returns 
     */
    handler: APIGatewayProxyHandler = async (event, _context, _callback) => {
        const apiId = event.path.split("/")[2];    // アクセスされたパスの2階層目を抽出
        let response: APIGatewayProxyResult;

        // アクセスされたパスに応じて実行するメソッドを切り替える
        switch(apiId) {
            case "musics": {
                const result = await this.fetchMusicsData(
                    event.pathParameters?.id,
                    event.queryStringParameters || undefined
                );

                response = this.proxyResponseBuilder(200, result);
                break;
            }
            case "blogs": {
                const result = await this.fetchBlogsData(
                    event.pathParameters?.id,
                    event.queryStringParameters || undefined
                );

                response = this.proxyResponseBuilder(200, result);
                break;
            }
            default: {
                response = this.proxyResponseBuilder(400, {
                    message: `Error: invalid Request -> ${event.resource}`
                })
                break;
            }
        }

        return response;
    }

    /**
     * musics用リポジトリからデータを取得する処理。
     * @param id 
     * @param queryParams 
     * @returns 
     */
    private fetchMusicsData = async (
        id?: string,
        queryParams?: {[key: string]: any}
    ): Promise<MusicsResult | MusicsResultList> => {
        const repository = this.musicsRepository;
        const result = id ?
                await repository.fetch(id)
            :
                await repository.fetchList(queryParams || {})
            
        return result
    }

    /**
     * blogs用リポジトリからデータを取得する処理。
     * @param id 
     * @param queryParams 
     * @returns 
     */
    private fetchBlogsData = async (
        id?: string,
        queryParams?: {[key: string]: any}
    ): Promise<BlogsResult | BlogsResultList> => {
        const repository = this.blogsRepository;
        const result = id ?
                await repository.fetch(id)
            :
                await repository.fetchList(queryParams || {})
            
        return result;
    }
}



export const main: APIGatewayProxyHandler = async (event, context, callback) => {
    return await handlerComUtil(context, async () => {
        const handler = new KickRequestToMicroCMSHandler();
        const response = await handler.handler(event, context, callback)
        return response;
    })
}
