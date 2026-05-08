import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import env from 'src/constants/env';

export const TYPE_ORM_CONFIG = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (cs: ConfigService) =>
    ({
      type: 'mysql',
      host: cs.get<string>(env.MYSQL_HOST),
      port: cs.get<number>(env.MYSQL_PORT),
      username: cs.get<string>(env.MYSQL_USER),
      password: cs.get<string>(env.MYSQL_PASSWORD),
      database: cs.get<string>(env.MYSQL_DBNAME),
      autoLoadEntities: true,
      synchronize: true, // ควรตั้งค่าเป็น false ใน production
      entities: ['dist/core/entities/*.entity{.ts,.js}'],
    }) as TypeOrmModuleOptions,
});
