import { MusicsSongCategoriesRepository } from '@/domain/repositories'
import { MusicsSongCategoriesRepositoryImpl } from '@/infrastructure/repositories'

type Props = {
    MusicsSongCategoriesRepository: MusicsSongCategoriesRepository
}

const container: Props = {
    MusicsSongCategoriesRepository: new MusicsSongCategoriesRepositoryImpl()
}

export default container