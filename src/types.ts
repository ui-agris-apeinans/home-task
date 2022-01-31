export interface Post {
    id: number;
    title: string;
    userId: number;
    body: string;
}

export interface DataGridPost extends Post {
    shortTitle: string;
    shortBody: string;
}