import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const issueProp = z.object({
    title: z.string(),
    workflowId: z.string(),
    description: z.string().optional(),
    createdById: z.string().optional(),
});

export const issueRouter = createTRPCRouter({
    createIssue: protectedProcedure.input(issueProp).mutation(async ({ ctx, input }) => {
        const lastCreatedIssue = await ctx.prisma.issue.findFirst({
            where: {
                workFlowId: input.workflowId,
            },
            orderBy: {
                index: 'desc',
            },
        });
        return ctx.prisma.issue.create({
            data: {
                title: input.title,
                index: lastCreatedIssue ? lastCreatedIssue.index + 1 : 0,
                workFlowId: input.workflowId,
                description: input.description,
                createdById: ctx.session.user.id,
            },
        });
    }),
    moveIssue: protectedProcedure.input(z.object({ issueId: z.string(), moveToWorkflowId: z.string(), newIndex: z.number() })).mutation(async ({ ctx, input }) => {
        const issue = await ctx.prisma.issue.findUniqueOrThrow({
            where: {
                id: input.issueId,
            },
            include: {
                workFlow: true,
            },
        });

        if (issue.workFlowId === input.moveToWorkflowId) {
            console.log("Moved within the same workflow");

            const issuesInWorkflow = await ctx.prisma.issue.findMany({
                where: {
                    workFlowId: issue.workFlowId,
                },
                orderBy: {
                    index: 'asc',
                },
            });

            const originalIndex = issuesInWorkflow.findIndex((issue) => issue.id === input.issueId);

            if (originalIndex > input.newIndex) {
                await ctx.prisma.issue.updateMany({
                    where: {
                        workFlowId: issue.workFlowId,
                        index: {
                            gte: input.newIndex,
                            lt: originalIndex,
                        },
                    },
                    data: {
                        index: {
                            increment: 1,
                        },
                    },
                });
            }
            else {
                await ctx.prisma.issue.updateMany({
                    where: {
                        workFlowId: issue.workFlowId,
                        index: {
                            gt: originalIndex,
                            lte: input.newIndex,
                        },
                    },
                    data: {
                        index: {
                            decrement: 1,
                        },
                    },
                });
            }

            await ctx.prisma.issue.update({
                where: {
                    id: input.issueId,
                },
                data: {
                    index: input.newIndex,
                },
            });

        }
        else {
            console.log("Moved to a different workflow");

            const issuesInWorkflow = await ctx.prisma.issue.findMany({
                where: {
                    workFlowId: issue.workFlowId,
                },
                orderBy: {
                    index: 'asc',
                },
            });

            const originalIndex = issuesInWorkflow.findIndex((issue) => issue.id === input.issueId);

            await ctx.prisma.issue.updateMany({
                where: {
                    workFlowId: input.moveToWorkflowId,
                    index: {
                        gte: input.newIndex,
                    },
                },
                data: {
                    index: {
                        increment: 1,
                    },
                },
            });

            await ctx.prisma.issue.updateMany({
                where: {
                    workFlowId: issue.workFlowId,
                    index: {
                        gte: originalIndex,
                    },
                },
                data: {
                    index: {
                        decrement: 1,
                    },
                },
            });

            await ctx.prisma.issue.update({
                where: {
                    id: input.issueId,
                },
                data: {
                    index: input.newIndex,
                    workFlowId: input.moveToWorkflowId,
                },
            });

        }

        return ctx.prisma.issue.findUnique({
            where: {
                id: input.issueId,
            },
        });

    }),

    getIssueById: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.issue.findUniqueOrThrow({
            where: {
                id: input.id,
            },
            include: {
                linkedIssues: true,
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
    getUserAssignedIssues: protectedProcedure.input(z.object({ userId: z.string().optional() })).query(({ ctx, input }) => {
        return ctx.prisma.issue.findMany({
            where: {
                assignees: {
                    some: {
                        id: input.userId || ctx.session.user.id,
                    },
                },
            },
            include: {
                workFlow: {
                    include: {
                        project: true,
                    }
                }
            },
        });
    }),
    updateIssueTitle: protectedProcedure.input(z.object({ title: z.string(), issueId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                title: input.title,
            },
        })
    }),
    updateIssueDescription: protectedProcedure.input(z.object({ description: z.string().nullable(), issueId: z.string() })).mutation(({ ctx, input }) => {
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
        issueId: z.string(), title: z.string(),
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
        checklistId: z.string(), title: z.string(),
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

    setDueDate: protectedProcedure.input(z.object({ issueId: z.string(), dueDate: z.date(), })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                dueDate: input.dueDate,
            },
        });
    }),

    removeDueDate: protectedProcedure.input(z.object({ issueId: z.string(), })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                dueDate: null,
            },
        });
    }),

    addFlag: protectedProcedure.input(z.object({ issueId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                flagged: true,
            },
        });
    }),

    removeFlag: protectedProcedure.input(z.object({ issueId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                flagged: false,
            },
        });
    }),

    addLabelToIssue: protectedProcedure.input(z.object({ issueId: z.string(), labelId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                labels: {
                    connect: {
                        id: input.labelId,
                    },
                },
            },
            select: {
                labels: true,
            },
        });
    }),

    removeLabelFromIssue: protectedProcedure.input(z.object({ issueId: z.string(), labelId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                labels: {
                    disconnect: {
                        id: input.labelId,
                    },
                },
            },
            select: {
                labels: true,
            },
        });
    }),

    getUnlinkedIssues: protectedProcedure.input(z.object({ issueId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.issue.findMany({
            where: {
                id: {
                    not: input.issueId,
                },
                linkedIssues: {
                    none: {
                        id: input.issueId,
                    },
                },
            },
            include:{
                linkedIssues: true,
            }
        });
    }),

    linkAnotherIssueToIssue: protectedProcedure.input(z.object({ issueId: z.string(), linkedIssueId: z.string() })).mutation(({ ctx, input }) => {

        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                linkedIssues: {
                    connect: {
                        id: input.linkedIssueId,
                    },
                },
            },
            include:{
                linkedIssues: true,
            }
        });
    }),

    unlinkAnotherIssueFromIssue: protectedProcedure.input(z.object({ issueId: z.string(), linkedIssueId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.issue.update({
            where: {
                id: input.issueId,
            },
            data: {
                linkedIssues: {
                    disconnect: {
                        id: input.linkedIssueId,
                    },
                },
            },
        });
    }),

    addAttachmentToIssue:protectedProcedure.input(z.object({issueId:z.string(),url:z.string(),displayName:z.string().optional()})).mutation(({ctx,input})=>{
        return ctx.prisma.attachment.create({
            data:{
                url:input.url,
                displayName:input.displayName,
                issueId:input.issueId,
            }
        })
    }),
    removeAttachmentFromIssue:protectedProcedure.input(z.object({attachmentId:z.string()})).mutation(({ctx,input})=>{
        return ctx.prisma.attachment.delete({
            where:{
                id:input.attachmentId
            }
        })
    })

});
