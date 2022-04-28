import { MicroCMSImage } from 'microcms-js-sdk';

/**
 * blogs APIのスキーマ
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