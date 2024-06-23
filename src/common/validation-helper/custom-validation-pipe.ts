import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { errorConverter } from '../exception-filter/error-converter.utils';

export const CustomValidationPipe = async (data: any[], dto: any) => {
    const validationPipe = new ValidationPipe({
        transform: true,

        exceptionFactory: (errors) => {
            const errorObject = errorConverter(errors); //convert validation error message
            throw new UnprocessableEntityException(errorObject);
        },
    });
    return await Promise.all(
        data.map((item: any) => {
            return validationPipe.transform(item, {
                metatype: dto,
                type: 'body',
            });
        }),
    );
};
