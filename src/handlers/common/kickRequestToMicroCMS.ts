import {
    APIGatewayProxyHandler,
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';
import MusicsRepositoryContainer from '@/containers/repositories/MusicsRepository';
import BlogsRepositoryContainer from '@/containers/repositories/BlogsRepository';



/**
 * MicroCMS APIにリクエストをキックする関数
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
        const apiId = event.path.split("/")[2];
        const id = event.pathParameters?.id;

        switch(apiId) {
            case "musics": {
                // TODO: DIコンテナ導入検討(パフォーマンスに問題なければ)
                const repository = MusicsRepositoryContainer.MusicsRepository
                
                const result = id ?
                    await repository.fetch(event.pathParameters?.id || "")
                :
                    await repository.fetchList()
                
                if(result.isSuccess()) {
                    return responseBuilder(200, result.data)
                } else {
                    throw result.data;
                }
            }
            case "blogs": {
                const repository = BlogsRepositoryContainer.BlogsRepository
                
                const result = id ?
                    await repository.fetch(event.pathParameters?.id || "")
                :
                    await repository.fetchList()
                
                if(result.isSuccess()) {
                    return responseBuilder(200, result.data)
                } else {
                    throw result.data;
                }
            }
            default:
                throw new Error(`Error: invalid Request -> ${event.resource}`)
        }
    })
}
