import { Component, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { Props } from './components/ModalWrapper';
type KeyboardOrMouseEvent = MouseEvent<any> | KeyboardEvent<any>;

interface State {}

export default class ModalDialog extends Component<Props, State> {}
