import { MusicsSongCategories } from '@/domain/model/musics'
import { Result } from '@/utilities/Result'

export interface MusicsSongCategoriesRepository {
    readonly API_ID: "musics";

    /**
     * カテゴリデータのリストを取得する
     */
    fetchList: () => Promise<Result<MusicsSongCategories, Error>>;
    
    /**
     * カテゴリデータを追加する
     * @param data 追加したいデータ
     */
    add: (data: MusicsSongCategories) => Promise<Result<MusicsSongCategories, Error>>;

    /**
     * カテゴリデータを削除する
     * @param data 追加したいデータ
     */
    delete: (data: MusicsSongCategories) => Promise<Result<MusicsSongCategories, Error>>;
}