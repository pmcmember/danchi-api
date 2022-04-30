import {
    MusicsRepository,
} from '@/domain/repositories'
import {
    MusicsResult,
    MusicsResultList,
    MusicsSchema
} from '@/domain/model/musics'

export class MusicsRepositoryMock implements MusicsRepository {
    readonly API_ID = "musics";

    public fetch = async (id: string) => {
        const result: MusicsResult = {
            rawIframe: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1231793908&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/danchi-bgm" title="DANCHi(BGM提供部)" target="_blank" style="color: #cccccc; text-decoration: none;">DANCHi(BGM提供部)</a> · <a href="https://soundcloud.com/danchi-bgm/futto" title="FUTTO" target="_blank" style="color: #cccccc; text-decoration: none;">FUTTO</a></div>',
            songCategories: [
                {
                    fieldId: "songCategory",
                    songCategory: "かっこいい"
                },
                {
                    fieldId: "songCategory",
                    songCategory: "おしゃれ"
                }
            ],
            scSrc: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1231793908&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false",
            scArtistName: "DANCHi(BGM提供部)",
            scArtistHref: "https://soundcloud.com/danchi-bgm",
            scSongTitle: "FUTTO",
            scSongHref: "https://soundcloud.com/danchi-bgm/futto",
            scApiUrl: "https://api.soundcloud.com/tracks/1231793908",
            scSongDescription: "企画中や動画のEDなんかにどぞ",
            scThumbnailSrc: "https://i1.sndcdn.com/artworks-2Aaz38RO72jExvbe-K0QOug-t500x500.jpg",
            createdAt: "2022/04/01 00:00:00",
            updatedAt: "2022/04/01 00:00:00",
            revisedAt: "2022/04/01 00:00:00",
            publishedAt: "2022/04/01 00:00:00"
        }

        return result
    }

    public fetchList = async () => {
        const result: MusicsResultList = {
            contents: [
                {
                    id: "futto",
                    rawIframe: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1231793908&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/danchi-bgm" title="DANCHi(BGM提供部)" target="_blank" style="color: #cccccc; text-decoration: none;">DANCHi(BGM提供部)</a> · <a href="https://soundcloud.com/danchi-bgm/futto" title="FUTTO" target="_blank" style="color: #cccccc; text-decoration: none;">FUTTO</a></div>',
                    songCategories: [
                        {
                            fieldId: "songCategory",
                            songCategory: "かっこいい"
                        },
                        {
                            fieldId: "songCategory",
                            songCategory: "おしゃれ"
                        }
                    ],
                    scSrc: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1231793908&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false",
                    scArtistName: "DANCHi(BGM提供部)",
                    scArtistHref: "https://soundcloud.com/danchi-bgm",
                    scSongTitle: "FUTTO",
                    scSongHref: "https://soundcloud.com/danchi-bgm/futto",
                    scApiUrl: "https://api.soundcloud.com/tracks/1231793908",
                    scSongDescription: "企画中や動画のEDなんかにどぞ",
                    scThumbnailSrc: "https://i1.sndcdn.com/artworks-2Aaz38RO72jExvbe-K0QOug-t500x500.jpg",
                    createdAt: "2022/04/01 00:00:00",
                    updatedAt: "2022/04/01 00:00:00",
                    revisedAt: "2022/04/01 00:00:00",
                    publishedAt: "2022/04/01 00:00:00"
                }
            ],
            limit: 10,
            offset: 0,
            totalCount: 1
        }

        return result
    }

    public update = async (id: string, data: MusicsSchema) => {
        return {
            id
        }
    }
}