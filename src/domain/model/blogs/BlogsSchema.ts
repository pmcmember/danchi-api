import { MicroCMSImage } from 'microcms-js-sdk';

export type BlogsSchema = {
    author: string[];
    title: string;
    image?: MicroCMSImage;
    categories: string[];
    tags?: string;
    description: string;
    content: string;
}