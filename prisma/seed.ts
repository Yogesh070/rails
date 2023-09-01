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
            emailVerified: true,
            workspaceId: null,
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