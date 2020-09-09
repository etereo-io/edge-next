export declare type FieldOptionType = {
  label: string;
  value: any;
}

export type CypherType = {
  enabled: boolean
  read: string[]
}

export declare type FieldType = {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  minlength?:number;
  maxlength?: number;
  required?: boolean;
  errorMessage?: string;
  description?: string;
  multiple?: boolean;
  hidden?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  options?: FieldOptionType[];
  accept?: string;
  capture?: string;
  defaultValue?: any;
  cypher?: CypherType
}