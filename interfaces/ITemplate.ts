export interface ITemplate {
  name: string;
  description: string;
  content: any;
  isGlobal: boolean;
  id: number;
  createdBy: string;
}

export interface ITemplateDetails extends ITemplate {
  id: number;
  isGlobal: boolean;
  createdBy: string;
  menuSize?: string;
  restaurant_id?: string;
}

export interface DeleteAssetsIDs {
  id: string;
  content: string;
}
