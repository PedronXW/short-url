import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Update Url', () => {
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

  it('should be able to update a url', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
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
      .patch('/url/' + url.body.url.id)
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        baseUrl: 'https://www.google.com.br',
      })

    expect(responseSearch.status).toBe(200)
    expect(responseSearch.body).toEqual({
      url: {
        id: expect.any(String),
        deletedAt: undefined,
        url: 'https://www.google.com.br',
        shortUrl: expect.any(String),
        accessCount: 0,
        userId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })
})
