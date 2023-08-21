import { create } from 'zustand';
import type { RouterOutputs } from '../utils/api';
import { devtools } from 'zustand/middleware';

type Sprint = RouterOutputs['sprint']['getSprints'][0];
type Issue = Sprint['issues'][0];
type StartSprint = RouterOutputs['sprint']['startSprint'];

type State = {
    sprints: Sprint[];
    backlogIssues: Issue[];
};

type Action = {
    setSprints: (sprints: Sprint[]) => void;
    addSprint: (sprint: Sprint) => void;
    removeSprint: (sprint: Sprint) => void;
    addSprintIssue: (sprintId: String, issue: Issue) => void;
    removeSprintIssue: (sprintId: String, issue: Issue) => void;
    startSprint: (sprint: StartSprint) => void;
    setBacklogIssues: (issues: Issue[]) => void;
    addBacklogIssue: (issue: Issue) => void;
    deleteBacklogIssue: (issue: Issue) => void;
    updateIssue: (issue: Issue, sprintId?: String) => void;
};

export const useSprintStore = create<State & Action>()(
    devtools((set) => ({
        sprints: [],
        backlogIssues: [],
        setSprints: (sprints) => set({ sprints }),
        addSprint: (sprint) =>
            set((state) => ({ sprints: [...state.sprints, sprint] })),
        removeSprint: (sprint) =>
            set((state) => ({
                sprints: state.sprints.filter((s) => s.id !== sprint.id),
            })),
        addSprintIssue: (sprintId, issue) =>
            set((state) => ({
                sprints: state.sprints.map((s) => {
                    if (s.id === sprintId) {
                        return { ...s, issues: [...s.issues, issue] };
                    }
                    return s;
                }),
            })),
        removeSprintIssue: (sprintId, issue) =>
            set((state) => ({
                sprints: state.sprints.map((s) => {
                    if (s.id === sprintId) {
                        return { ...s, issues: s.issues.filter((i) => i.id !== issue.id) };
                    }
                    return s;
                }),
            })),
        startSprint: (sprint) =>
            set((state) => ({
                sprints: state.sprints.map((s) => {
                    if (s.id === sprint.id) {
                        return { ...sprint, issues: s.issues };
                    }
                    return s;
                }
                ),
            })),
        setBacklogIssues: (issues) => set({ backlogIssues: issues }),
        addBacklogIssue: (issue) =>
            set((state) => ({ backlogIssues: [...state.backlogIssues, issue] })),
        deleteBacklogIssue: (issue) =>
            set((state) => ({
                backlogIssues: state.backlogIssues.filter((i) => i.id !== issue.id),
            })),
        updateIssue: (issue, sprintId) => {
            if (sprintId) {
                set((state) => ({
                    sprints: state.sprints.map((s) => {
                        if (s.id === sprintId) {
                            return {
                                ...s,
                                issues: s.issues.map((i) => {
                                    if (i.id === issue.id) {
                                        return issue;
                                    }
                                    return i;
                                })
                            }
                        }
                        return s;
                    }
                    ),
                }))
            } else {
                set((state) => ({
                    backlogIssues: state.backlogIssues.map((i) => {
                        if (i.id === issue.id) {
                            return issue;
                        }
                        return i;
                    }
                    ),
                    sprints: state.sprints.map((s) => {
                        if (s.issues.find((i) => i.id === issue.id)) {
                            return {
                                ...s,
                                issues: s.issues.map((i) => {
                                    if (i.id === issue.id) {
                                        return issue;
                                    }
                                    return i;
                                })
                            }
                        }
                        return s;
                    }),
                }))
            }
        },
    }))

);
