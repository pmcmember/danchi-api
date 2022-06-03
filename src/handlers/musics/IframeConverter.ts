import {
    APIGatewayProxyHandler,
} from 'aws-lambda';
import handlerComUtil from '@/utilities/handlerComUtil';
import { JSDOM } from 'jsdom';

import { MusicsSchema } from '@/domain/model/musics/MusicsSchema';
import { Handler } from '../Handler';
import { Singleton } from '@/decorators';


/**
 * Iframe変換
 */
@Singleton
export class IframeConverterHandler extends Handler {
    handler: APIGatewayProxyHandler = async (event, _context, _callback) => {
        if( ! event.body) {
            throw new Error("Error: event.body must be NOT null or NOT undefined.");
        }
        
        const data: MusicsSchema = JSON.parse(event.body);
        const convertedSchema = this.convertIframe(data);
        
        console.log(JSON.stringify(convertedSchema));
        
        return this.agProxyResponseBuilder<MusicsSchema>(200, convertedSchema)
    }

    private convertIframe = (musicsSchema: MusicsSchema): MusicsSchema => {
        const jsdom = new JSDOM(musicsSchema.rawIframe);
    
        const iframe = jsdom.window.document.querySelector("iframe")!;
        const [artistAncor, songAncor] = Array.from(jsdom.window.document.querySelectorAll("a"));
    
        return {
            ...musicsSchema,
            scSrc: iframe.src,
            scArtistName: artistAncor.title,
            scArtistHref: artistAncor.href,
            scSongTitle: songAncor.title,
            scSongHref: songAncor.href,
            scApiUrl: decodeURIComponent(
                iframe.src
                .split("?").filter((v) => v.match(/^url=.*$/))[0]
                .split("&")[0]
                .split("=")[1]
            )
        }
    }
}

export const main: APIGatewayProxyHandler = async (
    event,
    context,
    callback
  ) => {
    return await handlerComUtil(context, async() => {
        const handler = new IframeConverterHandler();
        const response = handler.handler(event, context, callback);
        return response;    
    })
}