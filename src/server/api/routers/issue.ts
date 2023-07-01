import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const issueProp = z.object({
    title: z.string(),
    workflowId: z.string(),
    index: z.number(),
    description: z.string().optional(),
    createdById: z.string(),
});

export const issueRouter = createTRPCRouter({
    createIssue: protectedProcedure.input(issueProp).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.create({
            data: {
                title: input.title,
                index: input.index,
                workFlowId: input.workflowId,
                description: input.description,
                createdById: input.createdById,
            },
        });
    }),
    getIssueById: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.issue.findUnique({
            where: {
                id: input.id,
            },
        });
    }),
    getIssuesByWorkflowId: protectedProcedure.input(z.object({ workflowId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.issue.findMany({
            where: {
                workFlowId: input.workflowId,
            },
        });
    }),
    updateIssueTitle: protectedProcedure.input(z.object({title:z.string(),issueId:z.string()})).mutation(({ctx,input})=>{
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                title: input.title,
            },
        })
    }),
    updateIssueDescription: protectedProcedure.input(z.object({description:z.string().nullable(),issueId:z.string()})).mutation(({ctx,input})=>{
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                description: input.description,
            },
        })
    }),
    deleteIssueById: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.delete({
            where: {
                id: input.id,
            },
        });
    }),
    assignIssueToUser: protectedProcedure.input(z.object({ issueId: z.string(), userId: z.array(z.string()) })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                assignees: {
                    connect: input.userId.map((id) => ({ id })),
                },
            },
        });
    }),
    unassignIssueFromUser: protectedProcedure.input(z.object({ issueId: z.string(), userId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                assignees: {
                    disconnect: {
                        id: input.userId
                    },
                },
            },
        });
    }),
    addComment: protectedProcedure.input(z.object({
        issueId: z.string(), comment: z.object({
            content: z.string(),
        })
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.comment.create({
            data: {
                message: input.comment.content,
                issueId: input.issueId,
                createdById: ctx.session.user.id,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
    }),
    getCommentsByIssueId: protectedProcedure.input(z.object({ issueId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.comment.findMany({
            where: {
                issueId: input.issueId,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            }
        });
    }),
    updateComment: protectedProcedure.input(z.object({
        issueId: z.string(), comment: z.object({
            id: z.string(),
            content: z.string(),
        })
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.comment.update({
            where: {
                id: input.comment.id,
            },
            data: {
                message: input.comment.content,
            },
        });
    }),
    deleteComment: protectedProcedure.input(z.object({ commentId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.comment.delete({
            where: {
                id: input.commentId,
            },
        });
    }),

    //checklist routes
    getChecklistsInIssue: protectedProcedure.input(z.object({ issueId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.checkList.findMany({
            where: {
                issueId: input.issueId,
            },
        });
    }),

    createChecklist: protectedProcedure.input(z.object({
        issueId: z.string(),title: z.string(),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.checkList.create({
            data: {
                title: input.title,
                issueId: input.issueId,
            },
        });
    }),

    updateChecklist: protectedProcedure.input(z.object({
        issueId: z.string(), checklist: z.object({
            id: z.string(),
            title: z.string(),
        })
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.checkList.update({
            where: {
                id: input.checklist.id,
            },
            data: {
                title: input.checklist.title,
            },
        });
    }),

    deleteChecklist: protectedProcedure.input(z.object({ checklistId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.checkList.delete({
            where: {
                id: input.checklistId,
            },
        });
    }),

    //checklist item routes
    getChecklistItemsInChecklist: protectedProcedure.input(z.object({ checklistId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.checkListItem.findMany({
            where: {
                checkListId: input.checklistId,
            },
        });
    }),

    createChecklistItem: protectedProcedure.input(z.object({
        checklistId: z.string(),title: z.string(),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.checkListItem.create({
            data: {
                title: input.title,
                checkListId: input.checklistId,
            },
        });
    }),

    updateChecklistItem: protectedProcedure.input(z.object({
        checklistId: z.string(), checklistItem: z.object({
            id: z.string(),
            title: z.string(),
        })
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.checkListItem.update({
            where: {
                id: input.checklistItem.id,
            },
            data: {
                title: input.checklistItem.title,
            },
        });
    }
    ),

    deleteChecklistItem: protectedProcedure.input(z.object({ checklistItemId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.checkListItem.delete({
            where: {
                id: input.checklistItemId,
            },
        });
    }
    ),

    changeChecklistItemStatus: protectedProcedure.input(z.object({
        checklistItemId: z.string(), checked: z.boolean(),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.checkListItem.update({
            where: {
                id: input.checklistItemId,
            },
            data: {
                checked: input.checked,
            },
        });
    }),
});
