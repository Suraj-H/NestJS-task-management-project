import { TypeOrmModuleOptions } from "@nestjs/typeorm"


export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '12345',
  database: 'task-management',
  autoLoadEntities: true,
  synchronize: true
}