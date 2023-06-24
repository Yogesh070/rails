import { create } from 'zustand'
import { RouterOutputs } from '../utils/api';

type Workspace = RouterOutputs['workspace']['getWorkspaceByShortName'];

type State = {
    workspace: Workspace | null,
}

type Action = {
    setWorkspace: (workspace: Workspace) => void,
}

export const useWorkspaceStore = create<State & Action>()((set) => ({
    workspace: null,
    setWorkspace: (workspace) => set({ workspace }),
}));
