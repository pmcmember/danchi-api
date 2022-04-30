import {
    APIGatewayProxyHandler,
} from 'aws-lambda';
import responseBuilder from '@/utilities/responseBuilder';
import handlerComUtil from '@/utilities/handlerComUtil';
import { JSDOM } from 'jsdom';

import { MusicsSchema } from '@/domain/model/musics/MusicsSchema';


/**
 * Iframe変換
 * @param event 
 * @param context 
 * @param _callback 
 */

export const main: APIGatewayProxyHandler = async (
    event,
    context,
    _callback
  ) => {
    return await handlerComUtil(context, async() => {
        if( ! event.body) {
            throw new Error("Error: event.body must be NOT null or NOT undefined.");
        }
        
        const data: MusicsSchema = JSON.parse(event.body);
        const convertedSchema = convertIframe(data);
        
        console.log(JSON.stringify(convertedSchema));
        
        return responseBuilder<MusicsSchema>(200, convertedSchema)
    })
}


const convertIframe = (musicsSchema: MusicsSchema): MusicsSchema => {
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