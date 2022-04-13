import { MusicsRepository } from '@/domain/repositories/MusicsRepository'
import { MusicsRepositoryImpl } from '@/infrastructure/repositories/MusicsRepository'

type Props = {
    MusicsRepository: MusicsRepository
}

const container: Props = {
    MusicsRepository: new MusicsRepositoryImpl()
}

export default container