import { BlogsRepository } from '@/domain/repositories/BlogsRepository';
import {
    BlogsSchema,
    BlogsResult,
    BlogsResultList
} from '@/domain/model/blogs'
import axios from 'axios';
import { Failure, Success } from '@/utilities/Result';

export class BlogsRepositoryImpl implements BlogsRepository {
    readonly API_ID = "blogs";
    readonly ENDPOINT_BASE = `${process.env.MICROCMS_API_BASEURL}/${this.API_ID}`

    constructor() {}

    public fetchList = async () => {
        try {
            const endpoint = `${this.ENDPOINT_BASE}`

            const res = await axios({
                method: "get",
                url: endpoint,
                headers: {
                    "Content-Type": "application/json",
                    "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
                }
            })

            return new Success(res.data as BlogsResultList);
        } catch(e) {
            return new Failure(e as Error)
        }
    }
    
    public fetch = async (id: string) => {
        try {
            const endpoint = `${this.ENDPOINT_BASE}/${id}`

            const res = await axios({
                method: "get",
                url: endpoint,
                headers: {
                    "Content-Type": "application/json",
                    "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
                }
            })

            return new Success(res.data as BlogsResult);
        } catch(e) {
            return new Failure(e as Error)
        }
    }
}