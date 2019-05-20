// import * as React from 'react';
// // import { CardLoading } from '../../utils/lightCards/cardLoading';
// import { Card as CardType } from './index';
// import { BrowserProps } from './browserReact';

// interface AsyncBrowserProps {
//   Card?: typeof CardType;
// }

// export default class BrowserLoader extends React.PureComponent<
// BrowserProps & AsyncBrowserProps,
//   AsyncBrowserProps
// > {
//   static displayName = 'AsyncCard';
//   static Card?: typeof CardType;

//   state = {
//     Card: Card.Card,
//   };

//   componentWillMount() {
//     if (!this.state.Card) {
//       import(/* webpackChunkName:"@atlaskit-internal_Card" */
//       './index').then(module => {
//         Card.Card = module.Card;
//         this.setState({ Card: module.Card });
//       });
//     }
//   }

//   render() {
//     const { dimensions } = this.props;

//     if (!this.state.Card) {
//       return <CardLoading dimensions={dimensions} />;
//     }

//     return <this.state.Card {...this.props} />;
//   }
// }
