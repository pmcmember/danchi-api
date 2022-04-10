import {
    Context,
    APIGatewayProxyResult
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import AWS from 'aws-sdk'

const createErrorMessage = (
    functionName: string,
    errorContent: string,
    region: string,
    logGroupName: string,
    logStreamName: string
): string => {
    const errorMessage = `
yubioriのEメール送信APIの${functionName}にて異常発生。

【エラー内容】
${errorContent || 'error message is nothing...'}

詳細は下記を確認してください。
https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/${logGroupName}/log-events/${logStreamName}
`
    return errorMessage
}


/**
 * lambdaハンドラー用エラーハンドリングなどの共通ユーティリティ
 * @param context 
 * @param mainCallback 
 */

const handlerComUtil = async (
    context: Context,
    mainCallback: () => Promise<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        response = await mainCallback();
    } catch(e) {
        const error = e as Error

        console.error(error.stack);

        const noticeMessage = createErrorMessage(
            context.functionName,
            error.message || 'error message is nothing...',
            process.env.AWS_REGION || process.env.REGION || "ap-northeast-1",
            context.logGroupName,
            context.logStreamName
        )

        try {
            if( ! process.env.SEND_ERROR_NOTICE_SNS_TOPIC_ARN) {
                throw new Error(`[ERROR]SEND_ERROR_NOTICE_SNS_TOPIC_ARN is empty.`)
            }
            
            const sns = new AWS.SNS();
            const result = await sns.publish({
                Message: noticeMessage,
                Subject: `[ERROR]yubiori api`,
                TopicArn: process.env.SEND_ERROR_NOTICE_SNS_TOPIC_ARN
            }).promise();

            console.log(`[INFO]SNS MessageId: ${result.MessageId}`)
        } catch(e) {
            const error = e as Error;
            console.error(error.stack)
        }

        response = responseBuilder(500, {message: "Can't Available Now"});
    }
    return response;
}

export default handlerComUtil