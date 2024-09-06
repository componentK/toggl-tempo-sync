interface TempoEntry {
    self: string;
    tempoWorklogId: number;
    jiraWorklogId: number;
    issue: {
        self: string;
        key: string;
        id: number;
    };
    timeSpentSeconds: number;
    billableSeconds: number;
    startDate: string;
    startTime: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    author: {
        self: string;
        accountId: string;
        displayName: string;
    };
    attributes: {
        self: string;
        values: any[]; // Assuming the values array can contain any type of values
    };
}
