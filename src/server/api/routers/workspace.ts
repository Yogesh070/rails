import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const generateUniqueShortName = async (ctx: any, name: string) => {
    const shortName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const existing = await ctx.prisma.workspace.findFirst({
        where: {
            shortName,
        },
    });
    if (!existing) {
        return shortName;
    }
    return `${shortName}-${Math.floor(Math.random() * 10000)}`;
};

const getRandomColor = () => {
    return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
};


export const workspaceRouter = createTRPCRouter({
    getWorkspaces: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.workspace.findMany({
            where: {
                OR: [
                    {
                        createdById: ctx.session.user.id,
                    },
                    {
                        members: {
                            some: {
                                id: ctx.session.user.id,
                            },
                        },
                    },
                ],
            },
        });
    }),
    getWorkspaceById: protectedProcedure.input(z.object({workspaceId:z.string()})).query(async ({ ctx, input }) => {
        return ctx.prisma.workspace.findUnique({
            where: {
                id: input.workspaceId,
            },
            include: {
                projects: {
                    include: {
                        projectLead: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });
    }),
    getWorkspaceByShortName: protectedProcedure.input(z.object({shortname:z.string()})).query(async({ctx,input})=>{
        const workspace = ctx.prisma.workspace.findFirst({
            where:{
                shortName: input.shortname,
            },
            include: {
                projects: {
                    include: {
                        projectLead: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        })
        return workspace;
    }),
    createWorkspace: protectedProcedure.input(z.object({ name: z.string(), description: z.string().nullable() })).mutation(async ({ ctx, input }) => {
        const shortName = await generateUniqueShortName(ctx, input.name);
        const color = getRandomColor();
        return ctx.prisma.workspace.create({
            data: {
                name: input.name,
                shortName,
                createdById: ctx.session.user.id,
                color,
                description: input.description,
            },
        });
    }),
    addMemberToWorkspace: protectedProcedure.input(z.object({ workspaceId: z.string(), userId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.workspace.update({
            where: {
                id: input.workspaceId,
            },
            data: {
                members: {
                    connect: {
                        id: input.userId,
                    },
                },

            },
        });
    }),
    removeMemberFromWorkspace: protectedProcedure.input(z.object({ workspaceId: z.string(), userId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.workspace.update({
            where: {
                id: input.workspaceId,
            },
            data: {
                members: {
                    disconnect: {
                        id: input.userId,
                    },
                },

            },
        });
    }),
    updateWorkspaceName: protectedProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.workspace.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
            },
        });
    }),
    deleteWorkspace: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        try {
            const workspaceToDelete = await ctx.prisma.workspace.findFirstOrThrow({
                where: {
                    id: input.id,
                },
            });
            if (ctx.session.user.id === workspaceToDelete?.createdById) {
                return ctx.prisma.workspace.delete({
                    where: {
                        id: input.id,
                    },
                });
            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You Dont have access to delete the Workspace",
                });
            }
        } catch (err) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "An unexpected error occurred",
            });
        }
    }),
});
