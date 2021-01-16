-- CreateTable
CREATE TABLE "Image" (
"id" SERIAL,
    "postId" INTEGER NOT NULL,
    "src" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD FOREIGN KEY("postId")REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
