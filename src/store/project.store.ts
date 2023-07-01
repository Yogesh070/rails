import { create } from 'zustand'
import { RouterOutputs } from '../utils/api';

type Project = RouterOutputs['project']['getProjectById'];
type ProjectWorkflowWithIssues = RouterOutputs['project']['getProjectWorkflows']['workflows'][number];

type State = {
    project: Project | null,
    workflows : ProjectWorkflowWithIssues[],
}

type Action = {
    setProject: (project: Project) => void,
    setProjectWorkflows: (workflows: ProjectWorkflowWithIssues[]) => void,
    addIssueToWorkflow: (workflowId: string, issue: ProjectWorkflowWithIssues['issue'][number]) => void,
}

export const useProjectStore = create<State & Action>()((set) => ({
    project: null,
    workflows: [],
    setProject: (project) => set({ project }),
    setProjectWorkflows: (workflows) => set({ workflows }),
    addIssueToWorkflow(workflowId, issue) {
        set((state) => ({
            workflows: state.workflows.map((workflow) => {
                if (workflow.id === workflowId) {
                    return {
                        ...workflow,
                        issue: [...workflow.issue, issue],
                    };
                }
                return workflow;
            }),
        }));
    }
}));
