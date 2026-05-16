export interface NoteHistory {
  id: string;
  content: string;
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  createdAt: number;
  history: NoteHistory[];
}
