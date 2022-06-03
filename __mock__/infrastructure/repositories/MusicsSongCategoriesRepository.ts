import {
    MusicsSongCategoriesRepository,
} from '@/domain/repositories'
import {
    MusicsSongCategoriesResultList,
} from '@/domain/model/musics'



export class MusicsSongCategoriesRepositoryMock implements MusicsSongCategoriesRepository {
    readonly API_ID = "musics";
    private testData: MusicsSongCategoriesResultList = [
        {
            name: "カテゴリ1"
        },
        {
            name: "カテゴリ2"
        }
    ]

    public fetchList = async () => {
        return this.testData
    }

    public add = async (data: MusicsSongCategoriesResultList) => {
        const result: MusicsSongCategoriesResultList = [...this.testData, ...data]

        return result;
    }

    public delete = async (data: MusicsSongCategoriesResultList) => {
        const strArrData = data.map((d) => d.name);
        const result: MusicsSongCategoriesResultList = this.testData.filter((t) => ! strArrData.includes(t.name));

        return result
    }
}