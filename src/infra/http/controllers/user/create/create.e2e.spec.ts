import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Create User', () => {
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

  it('should be able to create a user', async () => {
    const responseUser = await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(responseUser.status).toBe(201)
    expect(responseUser.body).toEqual({
      user: {
        id: expect.any(String),
        active: true,
        email: 'johndoe@johndoe.com',
      },
    })
  })
})
