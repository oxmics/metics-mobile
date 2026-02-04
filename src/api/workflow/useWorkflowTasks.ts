import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { WorkflowTask, WorkflowActionPayload, WorkflowDelegatePayload } from '../../types/workflow';

const WORKFLOW_TASKS_KEY = 'workflow-tasks';

export const useWorkflowTasks = () => {
    const api = useApi();

    return useQuery<WorkflowTask[]>({
        queryKey: [WORKFLOW_TASKS_KEY],
        queryFn: async () => {
            const response = await api.get('/workflow/tasks/');
            return response.data;
        },
    });
};

export const useWorkflowAction = () => {
    const queryClient = useQueryClient();
    const api = useApi();

    return useMutation({
        mutationFn: async ({ taskId, payload }: { taskId: string; payload: WorkflowActionPayload }) => {
            const response = await api.post(`/workflow/tasks/${taskId}/action/`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WORKFLOW_TASKS_KEY] });
        },
    });
};

export const useWorkflowDelegate = () => {
    const queryClient = useQueryClient();
    const api = useApi();

    return useMutation({
        mutationFn: async ({ taskId, payload }: { taskId: string; payload: WorkflowDelegatePayload }) => {
            const response = await api.post(`/workflow/tasks/${taskId}/delegate/`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WORKFLOW_TASKS_KEY] });
        },
    });
};

export default useWorkflowTasks;
