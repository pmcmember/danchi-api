import {
    DocumentClient
} from 'aws-sdk/clients/dynamodb';
import {
    Result,
    Success,
    Failure
} from '@/utilities/Result';




/**
 * TODO:リファクタ
 */



interface Singleton {
    instance: Singleton;
    getInstance(): Singleton;
    reset(): void;
}


export namespace DBService {
    // type def

    export type Key<T = any> = {
        [key: string]: T
    }
    export type Service = DocumentClient;
    export type PutInput = DocumentClient.PutItemInput;
    export type PutOutput = DocumentClient.PutItemOutput;
    export type GetInput = DocumentClient.GetItemInput;
    export type GetOutput = DocumentClient.GetItemOutput;
    export type BatchGetInput = DocumentClient.BatchGetItemInput;
    export type BatchGetOutput = DocumentClient.BatchGetItemOutput;
    export type QueryInput = DocumentClient.QueryInput;
    export type QueryOutput = DocumentClient.QueryOutput;
}


export interface DBService extends Singleton {
    service: DBService.Service;
    setService(service: DBService.Service): void;

    put(data: DBService.PutInput): Promise<Result<DBService.PutOutput, Error>>;
    get(data: DBService.GetInput): Promise<Result<DBService.GetOutput, Error>>;
    query(data: DBService.QueryInput): Promise<Result<DBService.QueryOutput, Error>>;
}


export class DBService implements DBService {
    protected static instance: DBService | null = null;

    public service: DBService.Service = new DocumentClient();

    protected constructor() {}

    public static getInstance(): DBService {
        try {
            if(DBService.instance === null) {
                DBService.instance = new DBService();
            }
            return DBService.instance;
        } catch(e) {
            throw e
        }
    }

    public static reset(): void {
        DBService.instance = null;
    }

    public async put(data: DBService.PutInput): Promise<Result<DBService.PutOutput, Error>> {
        try {
            const result = await this.service.put(data).promise();

            return new Success(result)
        } catch(e) {
            if(e instanceof Error) {
                return new Failure(e);
            } else {
                return new Failure(new Error(e as string));
            }
        }
    }

    public async get(data: DBService.GetInput): Promise<Result<DBService.GetOutput, Error>> {
        try {
            const result = await this.service.get(data).promise();

            return new Success(result);
        } catch(e) {
            if(e instanceof Error) {
                return new Failure(e);
            } else {
                return new Failure(new Error(e as string));
            }
        }
    }

    public async batchGet(data: DBService.BatchGetInput): Promise<Result<DBService.BatchGetOutput, Error>> {
        try {
            const result = await this.service.batchGet(data).promise();

            return new Success(result);
        } catch(e) {
            if(e instanceof Error) {
                return new Failure(e);
            } else {
                return new Failure(new Error(e as string));
            }
        }
    }

    public async query(data: DBService.QueryInput): Promise<Result<DBService.QueryOutput, Error>> {
        try {
            const result = await this.service.query(data).promise()

            return new Success(result);
        } catch(e) {
            if(e instanceof Error) {
                return new Failure(e);
            } else {
                return new Failure(new Error(e as string));
            }
        }
    }
}