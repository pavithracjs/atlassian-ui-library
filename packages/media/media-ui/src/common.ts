export type LozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';
export interface LozengeViewModel {
  text: string;
  appearance?: LozengeColor; // defaults to 'default'
  isBold?: boolean; // defaults to false
}
