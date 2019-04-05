import { TrackAEP } from './events';
import { IAction, IActionSubject, IActionSubjectId } from './enums';

export interface ISymbol {
  ARROW_RIGHT: 'rightArrow';
  ARROW_LEFT: 'leftArrow';
  ARROW_DOUBLE: 'doubleArrow';
}

export const SYMBOL: ISymbol = {
  ARROW_RIGHT: 'rightArrow',
  ARROW_LEFT: 'leftArrow',
  ARROW_DOUBLE: 'doubleArrow',
};

export interface IPunc {
  DASH: 'emDash';
  ELLIPSIS: 'ellipsis';
  QUOTE_SINGLE: 'singleQuote';
  QUOTE_DOUBLE: 'doubleQuote';
}

export const PUNC: IPunc = {
  DASH: 'emDash',
  ELLIPSIS: 'ellipsis',
  QUOTE_SINGLE: 'singleQuote',
  QUOTE_DOUBLE: 'doubleQuote',
};

type SubstituteAEP<ActionSubjectID, Attributes> = TrackAEP<
  IAction['SUBSTITUTED'],
  IActionSubject['TEXT'],
  ActionSubjectID,
  Attributes
>;

type SubstituteProductAEP = SubstituteAEP<
  IActionSubjectId['PRODUCT_NAME'],
  {
    product: string;
    originalSpelling: string;
  }
>;

type SubstituteSymbolAEP = SubstituteAEP<
  IActionSubjectId['SYMBOL'],
  {
    symbol:
      | ISymbol['ARROW_RIGHT']
      | ISymbol['ARROW_LEFT']
      | ISymbol['ARROW_DOUBLE'];
  }
>;

type SubstitutePuncAEP = SubstituteAEP<
  IActionSubjectId['PUNC'],
  {
    punctuation:
      | IPunc['DASH']
      | IPunc['ELLIPSIS']
      | IPunc['QUOTE_SINGLE']
      | IPunc['QUOTE_DOUBLE'];
  }
>;

export type SubstituteEventPayload =
  | SubstituteProductAEP
  | SubstituteSymbolAEP
  | SubstitutePuncAEP;
