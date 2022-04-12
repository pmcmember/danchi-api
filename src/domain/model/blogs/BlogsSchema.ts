import { MicroCMSImage } from 'microcms-js-sdk';

/**
 * blogs APIのスキーマ
 * 
 * 注：tagsは複数指定の場合改行区切りで指定される。
 */
export type BlogsSchema = {
    author: string[];
    title: string;
    image?: MicroCMSImage;
    categories: string[];
    tags?: Tag[];
    description: string;
    content: string;
}


type Tag = {
    fieldId: "tag";
    tag: string
}