import { MusicsSongCategoriesResultList } from '@/domain/model/musics'

export interface MusicsSongCategoriesRepository {
    readonly API_ID: "musics";

    /**
     * カテゴリデータのリストを取得する
     */
    fetchList: () => Promise<MusicsSongCategoriesResultList>;
    
    /**
     * カテゴリデータを追加する
     * @param data 追加したいデータ
     */
    add: (data: MusicsSongCategoriesResultList) => Promise<MusicsSongCategoriesResultList>;

    /**
     * カテゴリデータを削除する
     * @param data 追加したいデータ
     */
    delete: (data: MusicsSongCategoriesResultList) => Promise<MusicsSongCategoriesResultList>;
}