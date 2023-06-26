import { createTRPCRouter, publicProcedure } from "./trpc";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/user";
import { workflowRouter } from "./routers/workflow";
import { observable } from "@trpc/server/observable";
import { issueRouter } from "./routers/issue";
import { workspaceRouter } from "./routers/workspace";

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
  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
