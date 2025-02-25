
export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, unknown>;
}

export interface NotionPage {
  id: string;
  properties: Record<string, unknown>;
}

export interface NotionError {
  code: string;
  message: string;
}
