-- CreateIndex
CREATE INDEX "idx_comment_post_approved_created" ON "public"."comment"("postId", "approved", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_comment_author_created" ON "public"."comment"("authorId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_comment_parent" ON "public"."comment"("parentId");

-- CreateIndex
CREATE INDEX "idx_like_post_created" ON "public"."like"("postId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_like_user_created" ON "public"."like"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_post_status_created" ON "public"."post"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_post_category_status_created" ON "public"."post"("categoryId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_post_author_status_created" ON "public"."post"("authorId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_post_featured_status_created" ON "public"."post"("featured", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_post_tags" ON "public"."post"("tags");

-- CreateIndex
CREATE INDEX "idx_post_created_desc" ON "public"."post"("createdAt" DESC);
