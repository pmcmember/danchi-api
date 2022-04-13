import BlogsRepositoryContainer from '@/containers/repositories/BlogsRepository'
import MusicsRepositoryContainer from '@/containers/repositories/MusicsRepository'
import MusicsSongCategoriesRepositoryContainer from '@/containers/repositories/MusicsSongCategoriesRepository'

type Props = typeof BlogsRepositoryContainer & typeof MusicsRepositoryContainer & typeof MusicsSongCategoriesRepositoryContainer

const container: Props = {
    BlogsRepository: BlogsRepositoryContainer.BlogsRepository,
    MusicsRepository: MusicsRepositoryContainer.MusicsRepository,
    MusicsSongCategoriesRepository: MusicsSongCategoriesRepositoryContainer.MusicsSongCategoriesRepository
}


export default container