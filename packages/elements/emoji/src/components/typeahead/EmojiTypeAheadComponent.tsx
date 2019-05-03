import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import uuid from 'uuid';
import { PureComponent } from 'react';
import { EmojiProvider, OnEmojiProviderChange } from '../../api/EmojiResource';
import { defaultListLimit } from '../../util/constants';
import { toEmojiId } from '../../util/type-helpers';
import {
  EmojiDescription,
  EmojiSearchResult,
  OnEmojiEvent,
  SearchOptions,
  SearchSort,
  ToneSelection,
} from '../../types';
import debug from '../../util/logger';
import {
  typeAheadCancelledEvent,
  typeAheadSelectedEvent,
  typeAheadRenderedEvent,
} from '../../util/analytics';
import { EmojiContext } from '../common/internal-types';
import { createRecordSelectionDefault } from '../common/RecordSelectionDefault';
import EmojiList from './EmojiTypeAheadList';
import * as styles from './styles';
import {
  AnalyticsEventPayload,
  CreateUIAnalyticsEventSignature,
} from '@atlaskit/analytics-next';

export interface OnLifecycle {
  (): void;
}

export interface EmojiTypeAheadBaseProps {
  onSelection?: OnEmojiEvent;
  query?: string;
  listLimit?: number;

  onOpen?: OnLifecycle;
  onClose?: OnLifecycle;
  createAnalyticsEvent?: CreateUIAnalyticsEventSignature;
}

export interface Props extends EmojiTypeAheadBaseProps {
  emojiProvider: EmojiProvider;
}

export interface State {
  visible: boolean;
  emojis: EmojiDescription[];
  loading: boolean;
  pressed: boolean;
  selectedTone?: ToneSelection;
  openTime: number;
  renderStartTime: number;
  fireAnalyticsEvent: (payload: AnalyticsEventPayload) => void;
}

const isFullShortName = (query?: string) =>
  query &&
  query.length > 1 &&
  query.charAt(0) === ':' &&
  query.charAt(query.length - 1) === ':';

const uniqueExactShortNameMatchIndex = (
  searchResult: EmojiSearchResult,
  query?: string,
): number | undefined => {
  if (!query) {
    return undefined;
  }
  query = query.toLowerCase();
  let matchIndex: number | undefined;

  let index = 0;
  for (const emoji of searchResult.emojis) {
    if (query && emoji.shortName.toLowerCase() === query) {
      if (matchIndex === undefined) {
        matchIndex = index;
      } else {
        return;
      }
    }
    index++;
  }
  return matchIndex;
};

const getEventFirer = (
  createAnalyticsEvent?: CreateUIAnalyticsEventSignature,
) => {
  let sessionId = uuid();
  let selected = false;
  const fireEvent = (payload: AnalyticsEventPayload): void => {
    if (!createAnalyticsEvent) {
      return;
    }
    payload.attributes.sessionId = sessionId;
    if (payload.action === 'clicked' || payload.action === 'pressed') {
      selected = true;
    } else if (payload.action === 'cancelled') {
      sessionId = uuid();
      if (selected) {
        selected = false;
        return;
      }
      selected = false;
    }
    createAnalyticsEvent(payload).fire('fabric-elements');
  };

  return fireEvent;
};

export default class EmojiTypeAheadComponent extends PureComponent<
  Props,
  State
> {
  static childContextTypes = {
    emoji: PropTypes.object,
  };

  static defaultProps = {
    onSelection: () => {},
    onOpen: () => {},
    onClose: () => {},
    listLimit: defaultListLimit,
  };

  private emojiListRef: EmojiList | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: true,
      emojis: [],
      loading: true,
      pressed: false,
      openTime: Date.now(),
      renderStartTime: Date.now(),
      fireAnalyticsEvent: getEventFirer(props.createAnalyticsEvent),
      selectedTone: props.emojiProvider.getSelectedTone(),
    };
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  getChildContext(): EmojiContext {
    return {
      emoji: {
        emojiProvider: this.props.emojiProvider,
      },
    };
  }

  componentDidMount() {
    const { emojiProvider } = this.props;
    emojiProvider.subscribe(this.onProviderChange);
    this.onSearch(this.props.query);
  }

  componentWillUnmount() {
    const { emojiProvider, query } = this.props;
    const { emojis } = this.state;
    emojiProvider.unsubscribe(this.onProviderChange);
    this.fireAnalytics(
      typeAheadCancelledEvent(Date.now() - this.state.openTime, query, emojis),
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    const prevEmojiProvider = this.props.emojiProvider;
    const nextEmojiProvider = nextProps.emojiProvider;
    if (prevEmojiProvider !== nextEmojiProvider) {
      prevEmojiProvider.unsubscribe(this.onProviderChange);
      nextEmojiProvider.subscribe(this.onProviderChange);
      this.onSearch(nextProps.query);
    } else if (this.props.query !== nextProps.query) {
      this.onSearch(nextProps.query);
    }
  }

  fireAnalytics(payload: AnalyticsEventPayload) {
    const { fireAnalyticsEvent } = this.state;
    if (fireAnalyticsEvent) {
      fireAnalyticsEvent(payload);
    }
  }

  selectNext = () => {
    if (this.emojiListRef) {
      this.emojiListRef.selectNext();
    }
  };

  selectPrevious = () => {
    if (this.emojiListRef) {
      this.emojiListRef.selectPrevious();
    }
  };

  chooseCurrentSelection = () => {
    this.setState({ pressed: true });
    if (this.emojiListRef) {
      this.emojiListRef.chooseCurrentSelection();
    }
  };

  count = (): number => {
    const { emojis } = this.state;
    return (emojis && emojis.length) || 0;
  };

  getTone = (tone?: number): string | undefined => {
    return typeof tone === 'undefined'
      ? undefined
      : tone >= 0 && tone <= 5
      ? ['default', 'light', 'mediumLight', 'medium', 'mediumDark', 'dark'][
          tone
        ]
      : undefined;
  };

  private onSearch(query?: string) {
    const { emojiProvider, listLimit } = this.props;
    const options: SearchOptions = {
      limit: listLimit || defaultListLimit,
      skinTone: this.state.selectedTone,
    };

    if (query && query.replace(':', '').length > 0) {
      options.sort = SearchSort.Default;
    } else {
      // if empty query (i.e. typeahead triggered only) then only sort by usage
      options.sort = SearchSort.UsageFrequency;
    }

    this.setState({
      renderStartTime: Date.now(),
    });

    emojiProvider.filter(query, options);
  }

  private onSearchResult = (result: EmojiSearchResult): void => {
    const { emojis, query } = result;
    const wasVisible = this.state.visible;
    const visible = emojis.length > 0;
    this.fireAnalytics(
      typeAheadRenderedEvent(
        Date.now() - this.state.renderStartTime,
        query,
        emojis,
      ),
    );
    debug(
      'emoji-typeahead.applyPropChanges',
      emojis.length,
      wasVisible,
      visible,
    );

    this.setState({
      emojis: emojis,
      visible,
      loading: false,
    });

    if (isFullShortName(query)) {
      const matchIndex = uniqueExactShortNameMatchIndex(result, query);

      if (matchIndex !== undefined) {
        const onSelect = createRecordSelectionDefault(
          this.props.emojiProvider,
          this.props.onSelection,
        );
        this.fireSelectionEvent(result.emojis[matchIndex], true);
        onSelect(
          toEmojiId(result.emojis[matchIndex]),
          result.emojis[matchIndex],
        );
      }
    }

    if (wasVisible !== visible) {
      if (visible) {
        if (this.props.onOpen) {
          this.props.onOpen();
        }
      } else {
        if (this.props.onClose) {
          this.props.onClose();
        }
      }
    }
  };

  private fireSelectionEvent(emoji: EmojiDescription, exactMatch?: boolean) {
    const { query } = this.props;
    const { emojis, openTime, pressed, selectedTone } = this.state;

    this.fireAnalytics(
      typeAheadSelectedEvent(
        exactMatch || pressed,
        Date.now() - openTime,
        emoji,
        emojis,
        query,
        this.getTone(selectedTone),
        exactMatch,
      ),
    );
  }

  private onProviderChange: OnEmojiProviderChange = {
    result: this.onSearchResult,
  };

  private onEmojiListRef = (ref: EmojiList | null) => {
    this.emojiListRef = ref;
  };

  render() {
    const { emojiProvider, onSelection } = this.props;
    const recordUsageOnSelection = createRecordSelectionDefault(
      emojiProvider,
      (emojiId, emoji, event) => {
        this.fireSelectionEvent(emoji as EmojiDescription);
        if (onSelection) onSelection(emojiId, emoji, event);
      },
    );

    const { visible, emojis, loading } = this.state;
    const style = {
      display: visible ? 'block' : 'none',
    };

    const classes = classNames(['ak-emoji-typeahead', styles.emojiTypeAhead]);

    return (
      <div style={style} className={classes}>
        <EmojiList
          emojis={emojis}
          onEmojiSelected={recordUsageOnSelection}
          ref={this.onEmojiListRef}
          loading={loading}
        />
      </div>
    );
  }
}
