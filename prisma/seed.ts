import type { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
import { createRange } from '../src/utils/createRange';

const prisma = new PrismaClient()

async function main() {

    function createRandomUser(): User {
        return {
            id: faker.datatype.uuid(),
            email: faker.internet.email(),
            name: faker.name.fullName(),
            image: faker.image.avatar(),
            emailVerified: faker.datatype.datetime(),
            issueId: null
        }
    }

    const fakeUserDetail1 = createRandomUser();
    const fakeUserDetail2 = createRandomUser();

    const user1 = await prisma.user.create({
        data: fakeUserDetail1,
    })
    const user2 = await prisma.user.create({
        data: fakeUserDetail2,
    })

    console.log(user1, user2);

    const getRandomIssues=(count:number) => createRange(count).map((index) => {
        return {
            title: `Issue ${index}`,
            description: `Issue ${index} description`,
            index: index,
            createdById: user1.id,
        }
    })

    const project1 = await prisma.project.create({
        data: {
            name: 'Project 1',
            projectType: 'KANBAN',
            members: {
                connect: [{ id: user1.id }, { id: user2.id }],
            },
            projectLead: {
                connect: { id: user1.id },
            },
            workflows: {
                create: [
                    {
                        title: 'To Do',
                        index: 1,
                        issue:{
                            createMany:{
                                data:getRandomIssues(10)
                            }
                        }
                    },
                    {
                        title: 'Doing',
                        index: 1,
                        issue:{
                            createMany:{
                                data:getRandomIssues(5)
                            }
                        }
                    },
                    {
                        title: 'Done',
                        index: 1,
                    }
                    
                ]
            }

        },
    })

    const project2 = await prisma.project.create({
        data: {
            name: 'Project 2',
            projectType: 'KANBAN',
            members: {
                connect: { id: user1.id },
            },
            projectLeadId: user2.id,

        },
    })
    console.log(project1, project2);

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })