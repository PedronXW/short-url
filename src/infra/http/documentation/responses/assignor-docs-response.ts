import { ApiProperty } from '@nestjs/swagger'

export class AssignorDocsResponse {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    type: 'string',
    example: 'John Doe',
    maxLength: 140,
  })
  name: string

  @ApiProperty({
    type: 'string',
    example: 'johndoe@doe.com',
    maxLength: 140,
  })
  email: string

  @ApiProperty({
    type: 'string',
    example: '123.456.789-00',
    maxLength: 30,
  })
  document: string

  @ApiProperty({
    type: 'string',
    example: '(11) 91234-5678',
    maxLength: 20,
  })
  phone: string

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  active: boolean
}
