import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('FindUrlByShortened', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to find a url by id', async () => {
    await request(app.getHttpServer()).post('/user').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
      document: '12345678910',
      phone: '12345678910',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const url = await request(app.getHttpServer())
      .post('/url')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        baseUrl: 'https://www.google.com',
      })

    const shortenedUrl = url.body.url.shortUrl.split('/').pop()


    const responseSearch = await request(app.getHttpServer())
      .get("/"+shortenedUrl)
      .send()

    expect(responseSearch.status).toBe(302)
    expect(responseSearch.headers.location).toBe('https://www.google.com')
  })
})
