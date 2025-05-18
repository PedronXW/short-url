import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { Public } from '@/auth/public'
import { FindUrlByShortenedService } from '@/url/services/redirect'
import { Controller, Get, HttpException, Param, Res } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { ErrorDocsResponse } from '../../documentation/responses/error-docs-response'


@ApiTags('redirect')
@Public()
@Controller('/:shortened')
export class RedirectUrlController {
  constructor(private findUrlByShortened: FindUrlByShortenedService) {}

  @ApiParam({
    name: 'shortened',
    description: 'Shortened URL',
    type: 'string',
    required: true,
    example: 'abc123',
  })
  @ApiOkResponse({
    description: 'Redirects to the original URL',
  })
  @ApiBadRequestResponse({
    description: 'Error redirecting',
    type: ErrorDocsResponse,
  })
  @Get()
  async handle(
    @Param('shortened') shortened: string,
    @Res() res: any,
  ) {

    const url = await this.findUrlByShortened.execute({
      shortened,
    })

    if (url.isLeft()) {
      const error = url.value
      switch (error.constructor) {
        case InactiveError:
          throw new HttpException(error.message, 403)
        case NonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return res.redirect(url.value.url)
  }
}
