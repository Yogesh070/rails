import { ProjectType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

interface ProjectInfo {
    defaultWorkflows: string[];
    projectName: string;
}

const projectTypesList: Record<ProjectType, ProjectInfo> =
{
    KANBAN: {
        defaultWorkflows: ["Backlog", "In Progress", "Done"],
        projectName: "Kanban",
    },
    SCRUM: {
        defaultWorkflows: ["Backlog", "To Do", "In Progress", "Review", "Done"],
        projectName: "Scrum",
    }
}

export const projectRouter = createTRPCRouter({
    getAllProjects: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.project.findMany(
            {
                include: {
                    projectLead: {
                        select: {
                            name: true,
                        },
                    },
                },
            }
        );
    }),
    getProjectById: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.project.findUnique({
            where: {
                id: input.id,
            },
        });
    }
    ),
    //This is also avilable in the userRouter: getUserAllProjects
    getUserProjects: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.project.findMany({
            where: {
                OR: [
                    {
                        members: {
                            some: {
                                id: ctx.session.user.id,
                            },
                        },
                    },
                    {
                        projectLeadId: ctx.session.user.id,
                    },
                ],
            },
            include: {
                projectLead: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }),
    createProject: protectedProcedure.input(z.object({ name: z.string(), projectType: z.nativeEnum(ProjectType), })).mutation(async ({ ctx, input }) => {
        const defaultWorkflows = projectTypesList[input.projectType].defaultWorkflows;
        return ctx.prisma.project.create({
            data: {
                name: input.name,
                projectType: input.projectType,
                //DEFAULT set the project lead to the user who created the project
                projectLeadId: ctx.session.user.id,
                workflows: {
                    createMany: {
                        data: defaultWorkflows.map((workflow, index) => ({
                            title: workflow,
                            index: index,
                        })),
                        skipDuplicates: true,
                    },
                },

            },
        });
    }),
    updateProject: protectedProcedure.input(z.object({ id: z.string(), name: z.string(), projectType: z.nativeEnum(ProjectType), })).mutation(({ ctx, input }) => {
        return ctx.prisma.project.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
                projectType: input.projectType,
            },
        });
    }),
    deleteProject: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.project.delete({
            where: {
                id: input.id,
            },
        });
    }),

    assignUserToProject: protectedProcedure.input(z.object({ projectId: z.string(), userId: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.project.update({
            where: {
                id: input.projectId,
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
}
);
