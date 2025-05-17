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

  it('should be able to delete a user', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseDeleteUser = await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send()

    expect(responseDeleteUser.status).toBe(204)
  })

  it('should be able to find a deleted user', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseDeleteUser = await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send()

    const responseFindUser = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${body.tokens.accessToken}`)
      .send()

    expect(responseDeleteUser.status).toBe(204)
    expect(responseFindUser.status).toBe(403)
    expect(responseFindUser.body).toEqual({
      message: 'Entity non exists error, entity: User',
      statusCode: 403,
    })
  })
})
