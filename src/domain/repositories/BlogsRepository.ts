import {
    BlogsSchema,
    BlogsResult,
    BlogsResultList
} from '@/domain/model/blogs'
import { Result } from '@/utilities/Result'

export interface BlogsRepository {
    readonly API_ID: "blogs";

    /**
     * blogsデータを取得する
     * @param id 取得したいデータのID
     */
    fetch: (id: string) => Promise<Result<BlogsResult, Error>>;
    
    /**
     * blogsデータのリストを取得する
     */
    fetchList: () => Promise<Result<BlogsResultList, Error>>;
}