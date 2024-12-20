/*
  Warnings:

  - You are about to drop the `Analytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduledPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_mediaFileId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_mediaFileId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledPost" DROP CONSTRAINT "ScheduledPost_mediaFileId_fkey";

-- DropTable
DROP TABLE "Analytics";

-- DropTable
DROP TABLE "MediaFile";

-- DropTable
DROP TABLE "Metadata";

-- DropTable
DROP TABLE "ScheduledPost";

-- CreateTable
CREATE TABLE "Author" (
    "author_id" TEXT NOT NULL,
    "uniqueids" TEXT,
    "nicknames" TEXT,
    "followercount" INTEGER,
    "heartcount" INTEGER,
    "videocount" INTEGER,
    "signature" TEXT,
    "privateaccount" BOOLEAN,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("author_id")
);

-- CreateTable
CREATE TABLE "Following" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "in_folder_item" TEXT,
    "disappeared_item" TEXT,
    "uniqueids" TEXT,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "videoid" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "createtime" INTEGER,
    "diggcount" INTEGER,
    "playcount" INTEGER,
    "audioid" TEXT,
    "size" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("videoid")
);

-- CreateTable
CREATE TABLE "VideoDescription" (
    "videoid" TEXT NOT NULL,
    "author_id" TEXT,
    "createtime" INTEGER,
    "diggcount" INTEGER,
    "playcount" INTEGER,
    "audioid" TEXT,
    "size" TEXT,
    "itemmute" TEXT,
    "description" TEXT,

    CONSTRAINT "VideoDescription_pkey" PRIMARY KEY ("videoid")
);

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("author_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("author_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoDescription" ADD CONSTRAINT "VideoDescription_videoid_fkey" FOREIGN KEY ("videoid") REFERENCES "Video"("videoid") ON DELETE RESTRICT ON UPDATE CASCADE;
