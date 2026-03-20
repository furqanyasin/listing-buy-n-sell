# M11 — Blog & Content

## Overview

Phase 11 adds a full blog system with public reading, category filtering, and an admin CMS.

## Schema

`BlogPost` model — `slug` unique, `status: BlogPostStatus` (DRAFT/PUBLISHED/ARCHIVED), `tags: String[]`, `publishedAt` set automatically when status transitions to PUBLISHED.

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/blog` | Public | All published posts, optional `?category=` filter |
| GET | `/blog/categories` | Public | Distinct categories of published posts |
| GET | `/blog/:slug` | Public | Post detail (increments viewsCount) |
| GET | `/blog/admin/all` | ADMIN/EDITOR | All posts regardless of status |
| GET | `/blog/admin/:id` | ADMIN/EDITOR | Single post by ID (for edit form) |
| POST | `/blog` | ADMIN/EDITOR | Create post |
| PATCH | `/blog/:id` | ADMIN/EDITOR | Update post (author or admin) |
| DELETE | `/blog/:id` | ADMIN/EDITOR | Delete post (author or admin) |

## Frontend

- `/blog` — grid of `BlogCard` components, category filter pills, skeleton loading
- `/blog/[slug]` — detail page with `generateMetadata` (server) + `BlogPostClient` (client), author avatar, tags
- `/dashboard/admin/blog` — admin post list with edit/delete actions
- `/dashboard/admin/blog/new` — create form with auto-slug from title
- `/dashboard/admin/blog/[id]/edit` — edit form (prefilled via `useAdminBlogPost`)

## Hooks

- `useBlogPosts(category?)` — published posts, 5m staleTime
- `useBlogCategories()` — distinct categories, 10m staleTime
- `useBlogPost(slug)` — single post
- `useAdminBlogPosts()` — all posts for admin
- `useAdminBlogPost(id)` — single post by ID for edit form
- `useCreateBlogPost()`, `useUpdateBlogPost(id)`, `useDeleteBlogPost()`
