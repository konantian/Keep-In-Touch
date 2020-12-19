/*
  Warnings:

  - The migration will change the primary key for the `Tag` table. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
ADD PRIMARY KEY ("id", "name");
