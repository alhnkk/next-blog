/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- DropTable
DROP TABLE "public"."Post";

-- CreateTable
CREATE TABLE "public"."post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featuredImageId" TEXT,
    "featuredImageUrl" TEXT,
    "status" "public"."PostStatus" NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "iconId" TEXT,
    "iconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."like" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "avatarId" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT,
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "fileType" "public"."MediaType" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" DOUBLE PRECISION,
    "alt" TEXT,
    "caption" TEXT,
    "tags" TEXT[],
    "folder" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "public"."media_transformation" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "quality" INTEGER,
    "format" TEXT,
    "transformParams" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_transformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_media" (
    "id" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "mediaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "parentPath" TEXT,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_slug_key" ON "public"."post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "public"."category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "public"."category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "like_userId_postId_key" ON "public"."like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "media_transformation_mediaId_name_key" ON "public"."media_transformation"("mediaId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "post_media_postId_mediaId_key" ON "public"."post_media"("postId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "media_folder_path_key" ON "public"."media_folder"("path");

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "public"."media"("fileId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category" ADD CONSTRAINT "category_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "public"."media"("fileId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."media"("fileId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media_transformation" ADD CONSTRAINT "media_transformation_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("fileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_media" ADD CONSTRAINT "post_media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_media" ADD CONSTRAINT "post_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("fileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media_folder" ADD CONSTRAINT "media_folder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
