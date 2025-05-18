import { ApiProperty } from '@nestjs/swagger'

export class ErrorDocsResponse {
  @ApiProperty({
    type: 'string',
    example: '400',
    description: 'Error Code',
  })
  statusCode: number

  @ApiProperty({
    type: 'string',
    example: 'Bad Request',
    description: 'Error message',
  })
  message: string
}
