import {create} from 'zustand';
import type {RouterOutputs} from '../utils/api';
import {devtools} from 'zustand/middleware';

type Workspace = RouterOutputs['workspace']['getWorkspaces'][0];

type WorkspaceWithProject =
  RouterOutputs['workspace']['getWorkspaceByShortName'];

type State = {
  workspaces: Workspace[];
  currentWorkspace: WorkspaceWithProject | null;
};

type Action = {
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  setCurrentWorkspace: (workspace: WorkspaceWithProject) => void;
};

export const useWorkspaceStore = create<State & Action>()(
  devtools((set) => ({
    workspaces: [],
    currentWorkspace: null,
    setWorkspaces: (workspaces) => set({workspaces}),
    addWorkspace: (workspace) =>
      set((state) => ({workspaces: [...state.workspaces, workspace]})),
    setCurrentWorkspace: (workspace) => set({currentWorkspace: workspace}),
  }))
);
