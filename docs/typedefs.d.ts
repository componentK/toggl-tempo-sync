interface TempoEntry {
    self: string;
    tempoWorklogId: number;
    issue: {
        self: string; // e.g. https://apite.atlassian.net/rest/api/2/issue/12455
        id: number; // Atlassian issue ID, e.g. 12455
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
    };
    attributes: {
        self: string;
        values: any[]; // Assuming the values array can contain any type of values
    };
}

export interface TogglEntry {
    id: number;
    workspace_id: number;
    project_id: number;
    task_id: number | null;
    billable: boolean;
    start: Date8601; // ISO 8601 format
    stop: Date8601; // ISO 8601 format, e.g. 2024-12-15T22:33:00+00:00
    description: string; // e.g. "MAGENTO-123 This is a ticket"
    duration: number; // seconds of work time
    tags: string[];
    tag_ids: number[];
    duronly: boolean;
    at: Date8601;
    server_deleted_at: Date8601 | null;
    user_id: number; // e.g. 2301412
    uid: number; // e.g. 2301412, same as user_id?
    wid: number;
    pid: number;
}

export interface JiraAPIMyselfResponse {
    self: string; // "https://apite.atlassian.net/rest/api/3/user?accountId=5fad09b081b28800781c8491"
    accountId: string; // "5fad09b081b28800781c8491"
    accountType: string; // "atlassian"
    emailAddress: string; // "k@componentk.com"
    avatarUrls: {
        "48x48": string; // "https://secure.gravatar.com/avatar/76659f62f2e7c1584f735d549572be11?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FKK-2.png"
        "24x24": string;
        "16x16": string;
        "32x32": string;
    };
    displayName: string; // "Konstantin Kiritsenko"
    active: boolean; // true
    timeZone: string; // "Europe/Istanbul"
    locale: string; // "en_US"
    groups: JiraAPIGroupOrRole;
    applicationRoles: JiraAPIGroupOrRole;
    expand: string; // "groups,applicationRoles"
}

export interface JiraAPIReducedIssueResponse {
    issues: JiraAPIReducedIssue[]
}

export interface JiraAPIReducedIssue {
    id: string; // "17384"
    key: string; // "SW6M-120"
    expand: string; // "renderedFields,names,schema,operations,editmeta,changelog,versionedRepresentations"
    self: string; // "https://apite.atlassian.net/rest/api/3/issue/17384"
}

interface JiraAPIGroupOrRole {
    size: number; // 1
    items: any[]; // []
}

export type Date8601 = string; // String in the ISO 8601 format, e.g. YYYY-MM-ddT00:00:00.000+0000

export interface ConfigResponse {
    utc: string; // e.g. +04:00 or -05:00
    to: Date8601;
    from: Date8601;
    delete?: boolean | string; // whether to delete entries from Atlassian Tempo
    dryRun?: boolean | string; // if true, will not run ANY API calls that modify entries
    togglBaseURL: string; // URL of Toggl API service
    togglAPIToken: string; // Toggl API token

    tempoCloudURL: string; // URL of Tempo Cloud API
    tempoCloudApiKey: string; // Tempo Cloud API Authorize Key

    JiraApiURL: string;
    JiraUsername: string; // Atlassian username (email)
    JiraAPIKey: string; // API key
    JiraAccountId: string | null; // Atlassian main user account ID
    compact: {
        all: boolean; // whether to compact all entries with same summary into one or keep them all separate
        specificIssueKeys: string[]; // can compact only specific issue keys instead of all keys
    }
}
