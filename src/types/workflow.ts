export interface WorkflowTask {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    due_date: string;
    assignee: string;
    related_object_type: 'auction' | 'purchase_order';
    related_object_id: string;
    amount?: number;
    currency?: string;
}

export interface WorkflowActionPayload {
    action: 'approve' | 'reject';
    comment?: string;
}

export interface WorkflowDelegatePayload {
    assignee: string;
}
