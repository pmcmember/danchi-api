export type MicroCMSWebhookRequest<T> = {
    service: string;
    api: string;
    id: string | null;
    type: string;
    contents: {
        out: MicroCMSWebhookContents<T> | null;
        new: MicroCMSWebhookContents<T> | null
    } | null;
}

type MicroCMSWebhookContents<T> = {
    id: string;
    status: Array<"DRAFT" | "PUBLISH">;
    draftKey: string | null;
    draftValue: T | null;
    publishValue: T | null;
}