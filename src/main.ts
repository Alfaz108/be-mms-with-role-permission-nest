import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/exception-filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200'], // add the origins you want to allow
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
