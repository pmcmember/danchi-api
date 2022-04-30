import {
    BlogsRepository,
} from '@/domain/repositories'
import {
    BlogsResult,
    BlogsResultList
} from '@/domain/model/blogs'

export class BlogsRepositoryMock implements BlogsRepository {
    readonly API_ID = "blogs";

    public fetch = async (id: string) => {
        const result: BlogsResult = {
            author: ["danchi"],
            title: "test1",
            categories: ["test"],
            description: "test", 
            content: "test",
            createdAt: "2022/04/01 00:00:00",
            updatedAt: "2022/04/01 00:00:00",
            publishedAt: "2022/04/01 00:00:00",
            revisedAt: "2022/04/01 00:00:00"
        }

        return result
    }

    public fetchList = async () => {
        const result: BlogsResultList = {
            contents: [
                {
                    id: "test1",
                    author: ["danchi"],
                    title: "test1",
                    categories: ["test"],
                    description: "test", 
                    content: "test",
                    createdAt: "2022/04/01 00:00:00",
                    updatedAt: "2022/04/01 00:00:00",
                    publishedAt: "2022/04/01 00:00:00",
                    revisedAt: "2022/04/01 00:00:00"
                }
            ],
            limit: 10,
            offset: 0,
            totalCount: 1
        }

        return result
    }
}