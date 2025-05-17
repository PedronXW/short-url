import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Delete User', () => {
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

  it('should be able to find a user', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseFindUser = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send()

    expect(responseFindUser.status).toBe(200)
    expect(responseFindUser.body).toEqual({
      user: {
        id: expect.any(String),
        email: 'johndoe@johndoe.com',
        active: true,
      },
    })
  })
})
