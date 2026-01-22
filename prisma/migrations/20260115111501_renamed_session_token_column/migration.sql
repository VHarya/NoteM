/*
  Warnings:

  - You are about to drop the column `session_token` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "session_token",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
