import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Change Password', () => {
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

  it('should be able to change a user password', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUpdate = await request(app.getHttpServer())
      .patch(`/user/password`)
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        password: '12345678',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(200)
  })

  it('should not be able to change a user password because a invalid password', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUpdate = await request(app.getHttpServer())
      .patch(`/user/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        password: '123',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(400)
    expect(responseUpdate.body).toEqual({
      message: 'String must contain at least 8 character(s) in password',
      statusCode: 400,
    })
  })

  it('should not be able to change a user password because a wrong password', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUpdate = await request(app.getHttpServer())
      .patch(`/user/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send({
        password: 'wrongpassword',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(401)
    expect(responseUpdate.body).toEqual({
      message: 'Wrong credentials',
      statusCode: 401,
    })
  })
})
