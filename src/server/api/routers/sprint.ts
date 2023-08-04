import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const sprintRouter = createTRPCRouter({

    createSprintIssue: protectedProcedure.input(z.object({
        title: z.string(),
        index: z.number(),
        description: z.string().optional(),
        createdById: z.string().optional(),
        sprintId: z.string()
    })).mutation(async ({ ctx, input }) => {
        return ctx.prisma.sprint.update({
            where: {
                id: input.sprintId,
            },
            data: {
                issues: {
                    create: {
                        title: input.title,
                        index: input.index,
                        description: input.description,
                        createdById: ctx.session.user.id,
                    },
                },
            },
        });
    },),

    createAutoSprint: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {

        const generateSprintTitle = (sprintNumber: number) => {
            return `Sprint ${sprintNumber}`;
        };
        const totalSprints = await ctx.prisma.sprint.count({
            where: {
                projectId: input.projectId,
            },
        });
        return ctx.prisma.sprint.create({
            data: {
                title: generateSprintTitle(totalSprints + 1),
                projectId: input.projectId,
            },
        });
    },),
    getSprints: protectedProcedure.input(z.object({ projectId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.sprint.findMany({
            where: {
                projectId: input.projectId,
            },
            include: {
                issues: true,
            },
        });
    }),

    deleteSprint: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.sprint.delete({
            where: {
                id: input.id,
            },
        });
    }),

    updateSprint: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), startDate: z.string(), endDate: z.string(), goal: z.string().nullable() })).mutation(({ ctx, input }) => {
        return ctx.prisma.sprint.update({
            where: {
                id: input.id,
            },
            data: {
                title: input.title,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
                goal: input.goal,
            },
        });
    }),
    completeSprint: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.sprint.update({
            where: {
                id: input.id,
            },
            data: {
                isCompleted: true,
            },
        });
    }),
    startSprint: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), startDate: z.date(), endDate: z.date(), goal: z.string().nullable(), })).mutation(async ({ ctx, input }) => {
        const sprint =await ctx.prisma.sprint.findUnique({
            where: {
                id: input.id,
            },
        });
        if (sprint?.hasStarted) {
            throw new Error("Sprint has already started");
        }
        return ctx.prisma.sprint.update({
            where: {
                id: input.id,
            },
            data: {
                title: input.title,
                hasStarted: true,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
                goal: input.goal,
            },
        });
    }),
});