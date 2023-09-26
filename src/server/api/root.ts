import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/user";
import { workflowRouter } from "./routers/workflow";
import { issueRouter } from "./routers/issue";
import { workspaceRouter } from "./routers/workspace";
import { sprintRouter } from "./routers/sprint";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  workflow: workflowRouter,
  issue: issueRouter,
  workspace: workspaceRouter,
  sprint: sprintRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
