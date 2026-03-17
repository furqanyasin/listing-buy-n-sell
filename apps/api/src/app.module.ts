import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { ListingsModule } from './modules/listings/listings.module'
import { MediaModule } from './modules/media/media.module'
import { SearchModule } from './modules/search/search.module'
import { DealersModule } from './modules/dealers/dealers.module'
import { BlogModule } from './modules/blog/blog.module'
import { AdminModule } from './modules/admin/admin.module'
import { AppController } from './app.controller'

@Module({
  imports: [
    // ── Config (env vars) ───────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    // ── Rate Limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // ── Database ─────────────────────────────────────────────────────────────
    PrismaModule,

    // ── Feature Modules ───────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    ListingsModule,
    MediaModule,
    SearchModule,
    DealersModule,
    BlogModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
