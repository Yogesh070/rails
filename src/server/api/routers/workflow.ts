import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workflowRouter = createTRPCRouter({
    createWorkflow: protectedProcedure.input(z.object({ title: z.string(), projectId: z.string(), index: z.number() })).mutation(({ ctx, input }) => {
        return ctx.prisma.workFlow.create({
            data: {
                title: input.title,
                projectId: input.projectId,
                index: input.index,
            },
        });
    }),
    getAllProjectWorkflows: protectedProcedure.input(z.object({ projectId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.workFlow.findMany({
            where: {
                projectId: input.projectId,
            },
            include: {
                issues: true,
            },
        });
    }),
});
