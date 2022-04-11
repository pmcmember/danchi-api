import { MicroCMSListContent } from 'microcms-js-sdk'

export type MicroCMSWebhookRequest<T extends MicroCMSListContent> = {
    service: string;
    api: string;
    id: string | null;
    type: string;
    contents: {
        old: MicroCMSWebhookContents<T> | null;
        new: MicroCMSWebhookContents<T> | null
    } | null;
}

export type MicroCMSWebhookContents<T extends MicroCMSListContent> = {
    id: string;
    status: Array<"DRAFT" | "PUBLISH">;
    draftKey: string | null;
    draftValue: T | null;
    publishValue: T | null;
}