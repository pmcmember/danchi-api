import { MicroCMSListContent } from "microcms-js-sdk";
import { MicroCMSWebhookRequest } from "../common/MicroCMSWebhookRequest";
import { MusicsSchema } from "./MusicsSchema";

export type MusicsIframeConverterRequest = MicroCMSWebhookRequest<MusicsSchema & MicroCMSListContent>;