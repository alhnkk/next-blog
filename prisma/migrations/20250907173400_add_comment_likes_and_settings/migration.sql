/*
  Warnings:

  - You are about to drop the column `iconId` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `iconUrl` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImageId` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImageUrl` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `avatarId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_transformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."category" DROP CONSTRAINT "category_iconId_fkey";

-- DropForeignKey
ALTER TABLE "public"."media" DROP CONSTRAINT "media_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."media_folder" DROP CONSTRAINT "media_folder_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."media_transformation" DROP CONSTRAINT "media_transformation_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."post" DROP CONSTRAINT "post_featuredImageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_media" DROP CONSTRAINT "post_media_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_media" DROP CONSTRAINT "post_media_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_avatarId_fkey";

-- AlterTable
ALTER TABLE "public"."category" DROP COLUMN "iconId",
DROP COLUMN "iconUrl",
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "public"."post" DROP COLUMN "featuredImageId",
DROP COLUMN "featuredImageUrl",
ADD COLUMN     "featuredImage" TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "avatarId",
DROP COLUMN "avatarUrl",
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "public"."media";

-- DropTable
DROP TABLE "public"."media_folder";

-- DropTable
DROP TABLE "public"."media_transformation";

-- DropTable
DROP TABLE "public"."post_media";

-- DropEnum
DROP TYPE "public"."MediaType";

-- CreateTable
CREATE TABLE "public"."comment_like" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settings" (
    "id" SERIAL NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Next Blog',
    "siteDescription" TEXT DEFAULT 'Modern blog platformu',
    "siteLogo" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#1e40af',
    "accentColor" TEXT NOT NULL DEFAULT '#f59e0b',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "textColor" TEXT NOT NULL DEFAULT '#1f2937',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comment_like_userId_commentId_key" ON "public"."comment_like"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "public"."comment_like" ADD CONSTRAINT "comment_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_like" ADD CONSTRAINT "comment_like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
