import { ApiProperty } from '@nestjs/swagger'

export class PayableDocsResponse {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    type: 'number',
    example: 1000.0,
  })
  value: number

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2021-09-01T00:00:00.000Z',
  })
  emissionDate: Date

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assignorId: string

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  active: boolean
}
