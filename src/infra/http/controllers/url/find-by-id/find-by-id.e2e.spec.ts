import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('FindUrlById', () => {
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

    const responseSearch = await request(app.getHttpServer())
      .get('/url/' + url.body.url.id)
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send()

    expect(responseSearch.status).toBe(200)
    expect(responseSearch.body).toEqual({
      url: {
        id: expect.any(String),
        active: true,
        accessCount: 0,
        url: 'https://www.google.com',
        shortUrl: expect.any(String),
        userId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })
})
