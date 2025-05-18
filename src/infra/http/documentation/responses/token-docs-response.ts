import { ApiProperty } from '@nestjs/swagger'

export class TokenDocsResponse {
  @ApiProperty({
    type:'object',
    properties:{
      accessToken: {
        type: 'string',
        description: 'Access token',
      },
    }
  })
  tokens:{accessToken:string}
}
