import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Create Url', () => {
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

  it('should be able to create a url', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUrl = await request(app.getHttpServer())
      .post('/url')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        baseUrl: 'https://www.google.com',
      })

    expect(responseUrl.status).toBe(201)
    expect(responseUrl.body).toEqual({
      url: {
        id: expect.any(String),
        deletedAt: undefined,
        url: 'https://www.google.com',
        accessCount: 0,
        shortUrl: expect.any(String),
        userId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })
})
