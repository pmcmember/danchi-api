import { BlogsRepository } from '@/domain/repositories/BlogsRepository'
import { BlogsRepositoryImpl } from '@/infrastructure/repositories/BlogsRepository'

type Props = {
    BlogsRepository: BlogsRepository
}

const container: Props = {
    BlogsRepository: new BlogsRepositoryImpl()
}

export default container