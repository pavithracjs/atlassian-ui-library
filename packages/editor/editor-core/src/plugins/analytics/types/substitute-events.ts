import { TrackAEP } from './events';
import { IAction, IActionSubject, ACTION_SUBJECT_ID } from './enums';

export const enum SYMBOL {
  ARROW_RIGHT = 'rightArrow',
  ARROW_LEFT = 'leftArrow',
  ARROW_DOUBLE = 'doubleArrow',
}

export const enum PUNC {
  DASH = 'emDash',
  ELLIPSIS = 'ellipsis',
  QUOTE_SINGLE = 'singleQuote',
  QUOTE_DOUBLE = 'doubleQuote',
}

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
    symbol: SYMBOL.ARROW_RIGHT | SYMBOL.ARROW_LEFT | SYMBOL.ARROW_DOUBLE;
  }
>;

type SubstitutePuncAEP = SubstituteAEP<
  IActionSubjectId['PUNC'],
  {
    punctuation:
      | PUNC.DASH
      | PUNC.ELLIPSIS
      | PUNC.QUOTE_SINGLE
      | PUNC.QUOTE_DOUBLE;
  }
>;

export type SubstituteEventPayload =
  | SubstituteProductAEP
  | SubstituteSymbolAEP
  | SubstitutePuncAEP;
