import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { RolesGuard } from './common/guards/roles.guard'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { ListingsModule } from './modules/listings/listings.module'
import { MediaModule } from './modules/media/media.module'
import { SearchModule } from './modules/search/search.module'
import { DealersModule } from './modules/dealers/dealers.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { ConversationsModule } from './modules/conversations/conversations.module'
import { BlogModule } from './modules/blog/blog.module'
import { AdminModule } from './modules/admin/admin.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { ReferenceModule } from './modules/reference/reference.module'
import { PrismaModule } from './prisma/prisma.module'

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
    FavoritesModule,
    ConversationsModule,
    BlogModule,
    AdminModule,
    ReviewsModule,
    NotificationsModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [
    // ── Global Auth Guard (all routes require JWT unless @Public()) ───────────
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // ── Global Roles Guard ───────────────────────────────────────────────────
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // ── Global Exception Filter ──────────────────────────────────────────────
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // ── Global Response Interceptor ──────────────────────────────────────────
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
