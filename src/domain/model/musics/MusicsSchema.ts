/**
 * musics APIのスキーマ
 * 
 * 注：songCategoriesは複数指定の場合改行区切りで指定される。
 */
export type MusicsSchema = {
    rawIframe: string;
    songCategories?: SongCategory[];
    scSrc?: string;
    scArtistName?: string;
    scArtistHref?: string;
    scSongTitle?: string;
    scSongHref?: string;
    scApiUrl?: string;
    scSongDescription?: string;
    scThumbnailSrc?: string;
}

type SongCategory = {
    fieldId: "songCategory";
    songCategory: string
}