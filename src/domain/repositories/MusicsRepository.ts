import {
    MusicsSchema,
    MusicsResult,
    MusicsResultList
} from '@/domain/model/musics'
import { Result } from '@/utilities/Result'

export interface MusicsRepository {
    readonly API_ID: "musics";

    /**
     * musicsデータを取得する
     * @param id 取得したいデータのID
     */
    fetch: (id: string) => Promise<Result<MusicsResult, Error>>;
    
    /**
     * musicsデータのリストを取得する
     */
    fetchList: () => Promise<Result<MusicsResultList, Error>>;
    
    /**
     * musicsデータをupdateする
     * @param id updateしたいデータのID
     * @param data updateしたいデータ
     */
    update: (id: string, data: MusicsSchema) => Promise<Result<{id: string}, Error>>;
}