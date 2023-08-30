import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { emailService } from "../../services/email.service";

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
                members: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
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
                members: {
                    connect: {
                        id: ctx.session.user.id,
                    },
                },
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
    updateWorkspace: protectedProcedure.input(z.object({ workspaceName: z.string(), name: z.string(), description: z.string().nullable(), color:z.string(),website:z.string().nullable() })).mutation(async ({ ctx, input }) => {
        const workspace = await ctx.prisma.workspace.findFirst({
            where: {
                shortName: input.workspaceName,
            },
        });
        if (workspace?.createdById !== ctx.session.user.id) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You Dont have access to update the Workspace",
            });
        }
        return ctx.prisma.workspace.update({
            where: {
                id: workspace?.id,
            },
            data: {
                name: input.name,
                description: input.description,
                color: input.color,
                website: input.website,
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
    sendWorkspaceInvite: protectedProcedure.input(z.object({ workspaceId: z.string(), email: z.string().email() })).mutation(async ({ ctx, input }) => {
        const workspace = await ctx.prisma.workspace.findUniqueOrThrow({
            where: {
                id: input.workspaceId,
            },
            include: {
                members: true,
            },
        });
        if (workspace?.members.some((member) => member.email === input.email)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User already a member of the workspace",
            });
        }
        const invite = await ctx.prisma.invitationToken.create({
            data: {
                email: input.email,
                workspaceId: input.workspaceId,
                // Expires in 7 days
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                createdByEmail: ctx.session.user.email!,
            },
        });
        await emailService.sendInviteEmail(input.email, invite.token,workspace.name);
        return invite;

    }),
    getWorkspaceInviteById: publicProcedure.input(z.object({ token: z.string() })).query(async ({ ctx, input }) => {
        const token = await ctx.prisma.invitationToken.findUnique({
            where: {
                token: input.token,
            },
            include: {
                workspace: true,
            },
        });
        if (!token) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid token",
            });
        }
        if (token.expiresAt < new Date()) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Token has already expired. Please request a new invite.",
            });
        }
        return token;
    }),
    acceptWorkspaceInvite: protectedProcedure.input(z.object({ token: z.string(),email:z.string().email() })).mutation(async ({ ctx, input }) => {
        const token = await ctx.prisma.invitationToken.findUnique({
            where: {
                token: input.token,
            },
            include: {
                workspace: {
                    select: {
                        members: true,
                        shortName: true,
                    },
                },
            },
        });
        if (!token) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid token",
            });
        }
        if (token.expiresAt < new Date()) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Token has already expired. Please request a new invite",
            });
        }
        if (token.workspace.members.some((member) => member.email === token.email)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User already a member of the workspace",
            });
        }
        if(token.email !== input.email){
            throw new TRPCError({
                code: "CONFLICT",
                message: "Email does not match the invite",
            });
        }
        await ctx.prisma.workspace.update({
            where: {
                id: token.workspaceId,
            },
            data: {
                members: {
                    connect: {
                        email: token.email,
                    },
                },
            },
        });
        await ctx.prisma.invitationToken.delete({
            where: {
                token: input.token,
            },
        });
        return token.workspace;
    }
    ),
});
