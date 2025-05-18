import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Delete Url', () => {
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

  it('should be able to delete a url', async () => {
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

    const responseUrl = await request(app.getHttpServer())
      .post('/url')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        baseUrl: 'https://www.google.com',
      })

    const response = await request(app.getHttpServer())
      .delete('/url/' + responseUrl.body.url.id)
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send()

    expect(response.status).toBe(204)
  })

  it('should be able to delete a url and not find after a search', async () => {
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

    const responseUrl = await request(app.getHttpServer())
      .post('/url')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        baseUrl: 'https://www.google.com',
      })

    await request(app.getHttpServer())
      .delete('/url/' + responseUrl.body.url.id)
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send()

    const responseSearch = await request(app.getHttpServer())
      .get('/url')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .query({
        page: 1,
        limit: 10,
      })
      .send()

    expect(responseSearch.status).toBe(200)
    expect(responseSearch.body).toEqual({
      urls: [],
      urlsCount: 0,
    })
  })
})
