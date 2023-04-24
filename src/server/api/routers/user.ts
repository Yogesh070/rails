import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

//TODO: Might need to change the procedure :(protectedProcedure to some other superAdminProcedure ) to access data other than the user's own data

export const userRouter = createTRPCRouter({
    getAllUsers: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findMany();
    }
    ),
    getUserById: protectedProcedure.input(z.object({ userId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input.userId,
            },
        });
    }
    ),
    getUserAllProjects: protectedProcedure.input(z.object({ userId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input.userId,
            },
        }).projects();
    }
    ),
});
