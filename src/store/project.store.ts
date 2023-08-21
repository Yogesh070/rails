import { create } from 'zustand'
import type { RouterOutputs } from '../utils/api';

type Project = RouterOutputs['project']['getProjectById'];
type ProjectWorkflowWithIssues = RouterOutputs['project']['getProjectWorkflows']['workflows'][number];
type CheckList = RouterOutputs['issue']['getChecklistsInIssue'][0];
type Comment = RouterOutputs['issue']['getCommentsByIssueId'];
type Label = RouterOutputs['project']['getProjectLabels'][number];

type State = {
    project: Project | null,
    workflows : ProjectWorkflowWithIssues[],
    labels : Label[],
}

type Action = {
    setProject: (project: Project) => void,
    setProjectWorkflows: (workflows: ProjectWorkflowWithIssues[]) => void,
    addIssueToWorkflow: (workflowId: string, issue: ProjectWorkflowWithIssues['issue'][number]) => void,
    setLabels: (labels: Label[]) => void,
    addLabel: (label: Label) => void,
    deleteLabel: (labelId: String) => void,
    editLabel: (label: Label) => void,
    setChecklist: (workflowId:string ,issueId: string, checklist: CheckList[]) => void,
    setComment: (workflowId:string ,issueId: string, comment: Comment[]) => void,
    deleteComment : (workflowId:string ,issueId: string, commentId: string) => void,
}

export const useProjectStore = create<State & Action>()((set) => ({
    project: null,
    workflows: [],
    labels: [],
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
    },
    setLabels(labels) {
        set({ labels });
    },
    addLabel(label) {
        set((state) => ({ labels: [...state.labels, label] }));
    },
    deleteLabel(labelId) {
        set((state) => ({ labels: state.labels.filter((l) => l.id !== labelId) }));
    },
    editLabel(label) {
        set((state) => ({
            labels: state.labels.map((l) => {
                if (l.id === label.id) {
                    return label;
                }
                return l;
            }),
        }));
    },
    setChecklist(workFlowId, issueId, checklist) {

        set((state) => {
            const workflows = state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issue: workflow.issue.map((issue) => {
                            if (issue.id === issueId) {
                                return {
                                    ...issue,
                                    checklist,
                                };
                            }
                            return issue;
                        }),
                    };
                }
                return workflow;
            });
            return { workflows };
        });

        //if i cannot have workflowId as a parameter, then i can do this
        // set((state) => ({
        //     workflows: state.workflows.map((workflow) => {
        //         return {
        //             ...workflow,
        //             issue: workflow.issue.map((issue) => {
        //                 if (issue.id === issueId) {
        //                     return {
        //                         ...issue,
        //                         checklist,
        //                     };
        //                 }
        //                 return issue;
        //             }),
        //         };
        //     }
        // )}
        // ));
    },
    setComment(workFlowId, issueId, comment) {
        set((state) => ({
            workflows: state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issue: workflow.issue.map((issue) => {
                            if (issue.id === issueId) {
                                return {
                                    ...issue,
                                    comment,
                                };
                            }
                            return issue;
                        }),
                    };
                }
                return workflow;
            }),
        }));
    }
    ,
    deleteComment(workFlowId, issueId, commentId) {
        set((state) => ({
            workflows: state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issue: workflow.issue.map((issue) => {
                            if (issue.id === issueId) {
                                return {
                                    ...issue,
                                    // comment: issue.comment.filter((comment) => comment.id !== commentId),
                                };
                            }
                            return issue;
                        }),
                    };
                }
                return workflow;
            }),
        }));
    }
}));
