import {
    BlogsSchema,
    BlogsResult,
    BlogsResultList
} from '@/domain/model/blogs'

export type BlogsFetchListProps = {
    offset?: string;
    limit?: string;
    orders?: string;
    fields?: string;
    ids?: string;
    filters?: string;
}

export interface BlogsRepository {
    readonly API_ID: "blogs";

    /**
     * blogsデータを取得する
     * @param id 取得したいデータのID
     */
    fetch: (id: string) => Promise<BlogsResult>;
    
    /**
     * blogsデータのリストを取得する
     */
    fetchList: (props: BlogsFetchListProps) => Promise<BlogsResultList>;
}