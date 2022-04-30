import {
    MusicsSchema,
    MusicsResult,
    MusicsResultList
} from '@/domain/model/musics'

export type MusicsFetchListProps = {
    offset?: string;
    limit?: string;
    orders?: string;
    fields?: string;
    ids?: string;
    filters?: string;
}

export interface MusicsRepository {
    readonly API_ID: "musics";

    /**
     * musicsデータを取得する
     * @param id 取得したいデータのID
     */
    fetch: (id: string) => Promise<MusicsResult>;
    
    /**
     * musicsデータのリストを取得する
     */
    fetchList: (props: MusicsFetchListProps) => Promise<MusicsResultList>;
    
    /**
     * musicsデータをupdateする
     * @param id updateしたいデータのID
     * @param data updateしたいデータ
     */
    update: (id: string, data: MusicsSchema) => Promise<{id: string}>;
}