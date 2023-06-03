-- DropForeignKey
ALTER TABLE "CheckList" DROP CONSTRAINT "CheckList_issueId_fkey";

-- DropForeignKey
ALTER TABLE "CheckListItem" DROP CONSTRAINT "CheckListItem_checkListId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_workFlowId_fkey";

-- DropForeignKey
ALTER TABLE "UserActions" DROP CONSTRAINT "UserActions_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserActions" DROP CONSTRAINT "UserActions_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkFlow" DROP CONSTRAINT "WorkFlow_projectId_fkey";

-- AddForeignKey
ALTER TABLE "WorkFlow" ADD CONSTRAINT "WorkFlow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_workFlowId_fkey" FOREIGN KEY ("workFlowId") REFERENCES "WorkFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckList" ADD CONSTRAINT "CheckList_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckListItem" ADD CONSTRAINT "CheckListItem_checkListId_fkey" FOREIGN KEY ("checkListId") REFERENCES "CheckList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActions" ADD CONSTRAINT "UserActions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActions" ADD CONSTRAINT "UserActions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
