import { MicroCMSListContent } from "microcms-js-sdk";
// 相対パスでないとtypescript-json-schemaから読み取れない
import { MicroCMSWebhookRequest } from "../common/MicroCMSWebhookRequest";
import { MusicsSchema } from "./MusicsSchema";

export type MusicsCmsWebhookRequest = MicroCMSWebhookRequest<MusicsSchema & MicroCMSListContent>;