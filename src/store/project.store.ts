import { create } from 'zustand'
import type { RouterOutputs } from '../utils/api';
import type { Attachment, Issue } from '@prisma/client';
import { devtools } from 'zustand/middleware';
import type { Label as PLabel} from '@prisma/client';

type Project = RouterOutputs['project']['getProjectById'];
type ProjectWorkflowWithIssues = RouterOutputs['project']['getProjectWorkflows']['workflows'][number];
type CheckList = RouterOutputs['issue']['getChecklistsInIssue'][0];
type Comment = RouterOutputs['issue']['getCommentsByIssueId'];
type Label = RouterOutputs['project']['getProjectLabels'][number];
type Member = RouterOutputs['project']['assignUserToProject'];

type State = {
    project: Project | null,
    workflows: ProjectWorkflowWithIssues[],
}

type Action = {
    setProject: (project: Project) => void,
    setProjectWorkflows: (workflows: ProjectWorkflowWithIssues[]) => void,
    addIssueToWorkflow: (workflowId: string, issue: Issue) => void,
    addMemberToProject: (member: Member) => void,
    setLabels: (labels: Label[]) => void,
    addLabel: (label: Label) => void,
    deleteLabel: (labelId: String) => void,
    editLabel: (label: Label) => void,
    setChecklist: (workflowId: string, issueId: string, checklist: CheckList[]) => void,
    setComment: (workflowId: string, issueId: string, comment: Comment[]) => void,
    deleteComment: (workflowId: string, issueId: string, commentId: string) => void,
    updateIssue: (workflowId: string, issueId: string, issue: Issue) => void,
    updateIssueLabels: (workflowId: string, issueId: string, labels: PLabel[]) => void,
    addAttachmentToIssue: (workflowId: string, issueId: string, attachment: Attachment) => void,
    deleteAttachmentFromIssue: (workflowId: string, issueId: string, attachmentId: string) => void,
}

export const useProjectStore = create<State & Action>()(
    devtools((set) => ({
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
                        issues: [...workflow.issues, {
                            ...issue,
                            _count: {
                                comments: 0,
                                assignees: 0,
                                labels: 0,
                                linkedIssues: 0,
                            },
                            labels: [],
                            attachments: [],
                        }],
                    };
                }
                return workflow;
            }),
        }));
    },
    addMemberToProject(member) {
        set((state) => ({
            project: {
                ...state.project!,
                members: [...state.project!.members, member]
            }
        }));
    },
    setLabels(labels) {
        set((state) => ({
            project: {
                ...state.project!,
                labels,
            }
        }));
    },
    addLabel(label) {
        set((state) => ({
            project: {
                ...state.project!,
                labels: [...state.project!.labels, label]
            }
        }));
    },
    deleteLabel(labelId) {
        set((state) => ({
            project: {
                ...state.project!,
                labels: state.project!.labels.filter((l) => l.id !== labelId)
            }

        }));
    },
    editLabel(label) {
        set((state) => ({
            project: {
                ...state.project!,
                labels: state.project!.labels.map((l) => {
                    if (l.id === label.id) {
                        return label;
                    }
                    return l;
                }
                ),
            }
        }));
    },
    setChecklist(workFlowId, issueId, checklist) {

        set((state) => {
            const workflows = state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issues: workflow.issues.map((issue) => {
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
        //             issue: workflow.issues.map((issue) => {
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
                        issues: workflow.issues.map((issue) => {
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
                        issues: workflow.issues.map((issue) => {
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
    },

    updateIssue(workFlowId, issueId, issue) {
        set((state) => ({
            workflows: state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issues: workflow.issues.map((i) => {
                            if (i.id === issueId) {
                                return {
                                    ...issue,
                                    _count: {...i._count},
                                    labels: [...i.labels],
                                    attachments: [...i.attachments],
                                };
                            }
                            return i;
                        }),
                    };
                }
                return workflow;
            }),
        }));
    },
    updateIssueLabels(workFlowId, issueId, labels) {
        set((state) => ({
            workflows: state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issues: workflow.issues.map((i) => {
                            if (i.id === issueId) {
                                return {
                                    ...i,
                                    labels,
                                    attachments: [...i.attachments],
                                };
                            }
                            return i;
                        }),
                    };
                }
                return workflow;
            }),
        }));
    },

    addAttachmentToIssue(workFlowId, issueId, attachment) {
        set((state) => ({
            workflows: state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issues: workflow.issues.map((issue) => {
                            if (issue.id === issueId) {
                                return {
                                    ...issue,
                                    _count: {...issue._count},
                                    labels: [...issue.labels],
                                    attachments: [...issue.attachments, attachment],
                                };
                            }
                            return issue;
                        }),
                    };
                }
                return workflow;
            }),
        }));
    },
    deleteAttachmentFromIssue(workFlowId, issueId, attachmentId) {
        set((state) => ({
            workflows: state.workflows.map((workflow) => {
                if (workflow.id === workFlowId) {
                    return {
                        ...workflow,
                        issues: workflow.issues.map((issue) => {
                            if (issue.id === issueId) {
                                return {
                                    ...issue,
                                    labels: [...issue.labels],
                                    _count: {...issue._count},
                                    attachments: issue.attachments.filter((attachment) => attachment.id !== attachmentId),
                                };
                            }
                            return issue;
                        }),
                    };
                }
                return workflow;
            }),
        }));
    },

}))
);
