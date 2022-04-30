import { MusicsSongCategories } from '@/domain/model/musics'

export interface MusicsSongCategoriesRepository {
    readonly API_ID: "musics";

    /**
     * カテゴリデータのリストを取得する
     */
    fetchList: () => Promise<MusicsSongCategories>;
    
    /**
     * カテゴリデータを追加する
     * @param data 追加したいデータ
     */
    add: (data: MusicsSongCategories) => Promise<MusicsSongCategories>;

    /**
     * カテゴリデータを削除する
     * @param data 追加したいデータ
     */
    delete: (data: MusicsSongCategories) => Promise<MusicsSongCategories>;
}