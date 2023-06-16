import type { User } from '@prisma/client'
import { create } from 'zustand'
import { RouterOutputs } from '../utils/api';

type ProjectWithLead = RouterOutputs['project']['getUserProjects'][number];

type State = {
    defaultAssignee: User | null,
    project: ProjectWithLead | null,
    members: User[],
}

type Action = {
    setDefaultAssignee: (member: User) => void,
    setProject: (project: ProjectWithLead) => void,
    setProjectMembers: (members: User[]) => void,
}

export const useProjectStore = create<State & Action>()((set) => ({
    project: null,
    members: [],
    defaultAssignee: null,
    setDefaultAssignee: (member) => set({ defaultAssignee: member }),
    setProject: (project) => set({ project }),
    setProjectMembers: (members) => set({ members }),
}))
