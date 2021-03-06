import { BlogsRepository, BlogsFetchListProps as FetchListProps } from '@/domain/repositories/BlogsRepository';
import {
    BlogsResult,
    BlogsResultList
} from '@/domain/model/blogs'
import axios from 'axios';
import { Singleton } from '@/decorators';

@Singleton
export class BlogsRepositoryImpl implements BlogsRepository {
    readonly API_ID = "blogs";
    readonly ENDPOINT_BASE = `${process.env.MICROCMS_API_BASEURL}/${this.API_ID}`

    constructor() {
        if( ! process.env.MICROCMS_API_BASEURL) {
            throw new Error("Error: BlogsRepositoryImpl: process.env.MICROCMS_API_BASEURL is undefined.");
        }
    }

    private createQueryParams = (queries: FetchListProps) => {
        const result = Object.keys(queries).reduce((pre, crr) => {
            const _crr = crr as keyof FetchListProps
            return pre + `?${crr}=${encodeURIComponent(queries[_crr] || "")}`
        }, "");

        return result;
    }

    public fetchList = async (props: FetchListProps) => {
        const endpoint = `${this.ENDPOINT_BASE}`
        const queries = (this.createQueryParams(props))

        const res = await axios({
            method: "get",
            url: endpoint + queries,
            headers: {
                "Content-Type": "application/json",
                "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
            }
        })

        return res.data as BlogsResultList
    }
    
    public fetch = async (id: string) => {
        const endpoint = `${this.ENDPOINT_BASE}/${id}`

        const res = await axios({
            method: "get",
            url: endpoint,
            headers: {
                "Content-Type": "application/json",
                "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
            }
        })

        return res.data as BlogsResult;
    }
}