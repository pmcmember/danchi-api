import { Context } from 'aws-lambda'

export const createContext = (custom?: Partial<Context>): Context => {
    return {
        callbackWaitsForEmptyEventLoop: false,
        functionName: "",
        functionVersion: "",
        invokedFunctionArn: "",
        memoryLimitInMB: "",
        awsRequestId: "",
        logGroupName: "",
        logStreamName: "",
        identity: undefined,
        clientContext: undefined,
        getRemainingTimeInMillis: () => 0,
        done: (error?: Error, result?: any) => undefined,
        fail: (error: Error | string) => undefined,
        succeed: (messageOrObject: any) => undefined,
        ...custom
    }
}