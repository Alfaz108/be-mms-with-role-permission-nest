import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/exception-filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors({
    origin: [
      'http://localhost:7070',
      'https://fe-mms-with-role-permission-mui-react.vercel.app/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(7070);
}
bootstrap();
