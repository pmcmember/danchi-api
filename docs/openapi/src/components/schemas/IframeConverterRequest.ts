import { MicroCMSListContent } from "microcms-js-sdk";
import { MicroCMSWebhookRequest } from "./MicroCMSWebhookRequest";
import { MusicsSchema } from "./MusicsSchema";

export type IframeConverterRequest = MicroCMSWebhookRequest<MusicsSchema & MicroCMSListContent>;