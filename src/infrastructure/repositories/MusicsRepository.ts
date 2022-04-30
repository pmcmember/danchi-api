import { MusicsRepository, MusicsFetchListProps as FetchListProps } from '@/domain/repositories/MusicsRepository'
import { MusicsResult, MusicsResultList, MusicsSchema } from '@/domain/model/musics'
import axios from 'axios';
import { Singleton } from '@/decorators';

@Singleton
export class MusicsRepositoryImpl implements MusicsRepository {
    readonly API_ID = "musics";
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
        const queries = this.createQueryParams(props)

        const res = await axios({
            method: "get",
            url: endpoint + queries,
            headers: {
                "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
            }
        })

        if(res.status < 200 || res.status >= 400) {
            throw new Error(`Error: MusicsRepository.fetchList(). \nError text -> ${JSON.stringify(res.data)}`)
        } 

        return res.data as MusicsResultList;
    }
    
    public fetch = async (id: string) => {
        const endpoint = `${this.ENDPOINT_BASE}/${id}`

        const res = await axios({
            method: "get",
            url: endpoint,
            headers: {
                "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
            }
        })

        if(res.status < 200 || res.status >= 400) {
            throw new Error(`Error: MusicsRepository.fetch(). \nError text -> ${JSON.stringify(res.data)}`)
        } 

        return res.data as MusicsResult
    };

    public update = async (id: string, data: MusicsSchema) => {
        const endpoint = `${this.ENDPOINT_BASE}/${id}`;

        const res = await axios({
            method: "patch",
            url: endpoint,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || ""
            }
        })

        if(res.status < 200 || res.status >= 400) {
            throw new Error(`Error: MusicsRepository.update(). \nError text -> ${JSON.stringify(res.data)}`)
        } 

        return res.data;
    }
}