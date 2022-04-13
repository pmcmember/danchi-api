import { MusicsSongCategoriesRepository } from '@/domain/repositories/MusicsSongCategoriesRepository';
import { MusicsSongCategories } from '@/domain/model/musics/MusicsSongCategories'
import { DocumentClient, WriteRequests, WriteRequest } from 'aws-sdk/clients/dynamodb';
import { Failure, Success } from '@/utilities/Result';

export class MusicsSongCategoriesRepositoryImpl implements MusicsSongCategoriesRepository {
    readonly API_ID = "musics";
    private readonly DB_NAME = process.env.SONG_CATEGORY_DB_NAME || ""
    private db: DocumentClient;

    public constructor() {
        if( ! process.env.SONG_CATEGORY_DB_NAME) {
            throw new Error("Error: SongCategoriesRepositoryImpl: process.env.SONG_CATEGORY_DB_NAME is undefined.");
        }

        try {
            this.db = new DocumentClient();
        } catch(e) {
            throw e;
        }
    }

    /**
     * カテゴリデータのリストを取得する
     */
    fetchList = async () => {
        try {
            const result = await this.db.scan({
                TableName: this.DB_NAME
            }).promise();

            return new Success((result.Items || [{name: ""}]) as MusicsSongCategories)
        } catch(e) {
            return new Failure(e as Error);
        }
    }
    
    /**
     * カテゴリデータを追加する
     * @param data 追加したいデータ
     */
    add = async (data: MusicsSongCategories) => {
        try {
            await this.db.batchWrite({
                RequestItems: {
                    [this.DB_NAME]: this.convertToBatchWriteItems(data, "PutRequest")
                }
            }).promise();

            const result = await this.fetchList();

            if(result.isFailure()) {
                throw result.data;
            }

            return new Success(result.data as MusicsSongCategories)
        } catch(e) {
            return new Failure(e as Error);
        }
    }

    /**
     * カテゴリデータを削除する
     * @param data 追加したいデータ
     */
    delete = async (data: MusicsSongCategories) => {
        try {
            await this.db.batchWrite({
                RequestItems: {
                    [this.DB_NAME]: this.convertToBatchWriteItems(data, "DeleteRequest")
                }
            }).promise();

            const result = await this.fetchList();

            if(result.isFailure()) {
                throw result.data;
            }

            return new Success(result.data as MusicsSongCategories)
        } catch(e) {
            return new Failure(e as Error);
        }
    }

    /**
     * DocumentClient.BatchWrite用リクエストデータ構造に変換する関数
     * @param data 変換したいデータ
     * @param request BatchWriteリクエスト内容
     */
    private convertToBatchWriteItems = (
        data: {[key: string]: any}[],
        request: keyof WriteRequest
    ): WriteRequests => {
        const key = request === "DeleteRequest"? "Key": "Item";

        return data.map((d) => {
            return {
                [request]: {
                    [key]: d
                }
            }
        })
    }
}