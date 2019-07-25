// @flow
/** @jsx jsx */

import {
  PureComponent,
  Children,
  // $FlowFixMe "there is no `forwardRef` export in `react`"
  forwardRef,
  createRef,
  type ElementRef,
} from 'react';
import memoize from 'memoize-one';
import applyRef from 'apply-ref';
import { jsx } from '@emotion/core';
import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';

import {
  RefinementBarProvider,
  RefinementBarContext,
  type CommonProps,
  type ProviderContext,
  type ValuesType,
} from './ContextProvider';
import Popup, { DialogInner } from './Popup';
import { FilterButton } from './FilterButton';
import { FilterManager } from './FilterManager';

import { cloneObj, isEqualArr, objectMap, stringCompare } from '../utils';
import {
  createAndFire,
  defaultAttributes,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '../analytics';

type Props = {
  /** The key of the "active" popup; use this with `onPopupOpen` and `onPopupClose` to take control of the field popups. */
  activePopupKey?: string | null,
  /** Internal. Passed in dynamically. */
  createAnalyticsEvent: (*) => any,
  /** Called when a field popup is opened, with the field key. */
  onPopupOpen?: (key: string) => void,
  /** Called when a field popup is closed. */
  onPopupClose?: () => void,
  /** Access the field elements by reference. Any keys present should match those of the `fieldConfig`. */
  refs: Object,
};
type State = {
  activePopupKey: string | null,
  invalid: { [key: string]: string },
  isExpanded: boolean,
  values: ValuesType,
};

class ActualRefinementBar extends PureComponent<Props, State> {
  constructor(props: Props, context: ProviderContext) {
    super(props, context);

    // declared here once so react-select can keep track of the keys;
    // helps with the focused option, scroll tracking etc.
    this.filterOptions = context.removeableKeys.map(this.mapKeyToOption);

    this.state = {
      activePopupKey: null,
      invalid: {},
      isExpanded: true,
      values: context.value || {},
    };
  }

  static contextType = RefinementBarContext;

  static defaultProps = {
    refs: {},
  };

  filterOptions: Array<Object>;

  showLessRef: ElementRef<*> = createRef();

  showAllRef: ElementRef<*> = createRef();

  analyticsTimer: TimeoutID;

  // ==============================
  // Popups
  // ==============================

  getActivePopup = () => {
    return this.props.activePopupKey === undefined
      ? this.state.activePopupKey
      : this.props.activePopupKey;
  };

  openPopup = key => {
    const { onPopupOpen } = this.props;

    if (onPopupOpen) onPopupOpen(key);

    this.setState({ activePopupKey: key });
  };

  closePopup = () => {
    const { onPopupClose } = this.props;

    if (onPopupClose) onPopupClose();

    this.setState({ activePopupKey: null });
  };

  // ==============================
  // Analytics
  // ==============================

  handleIdleAnalyticsEvent = values => {
    clearTimeout(this.analyticsTimer);

    // NOTE: Five seconds is arbitrary. Our assumption is that it's enough time
    // to ensure the user has "committed" to a search/filter.
    const idleDuration = 5000;
    const { createAnalyticsEvent } = this.props;

    this.analyticsTimer = setTimeout(() => {
      // NOTE: we must avoid personally identifiable information, so the payload
      // SHOULD NOT contain any actual values.
      const filters = objectMap(values, (val, key) => {
        const field = this.context.fieldConfig[key];
        const filterType = field.type.name;

        // Augment where possible with additional data related to the filter
        // type. For example, number may be greater than / less than etc.
        let additionalData = null;
        switch (filterType) {
          case 'Number':
          case 'Text':
            additionalData = { type: val.type };
            break;
          default:
        }

        return {
          filterType,
          additionalData,
        };
      });

      createAndFire({
        action: 'idle-submit',
        attributes: defaultAttributes,
        filters,
      })(createAnalyticsEvent);
    }, idleDuration);
  };

  // ==============================
  // Field Handlers
  // ==============================

  handleFieldAdd = async (key: string) => {
    const field = this.context.fieldConfig[key];
    const data = field.getInitialValue();
    const meta = { action: 'add', key, data };
    const values = await cloneObj(this.state.values, { add: { [key]: data } });

    this.openPopup(key);

    this.setState({ values, isExpanded: true }, () => {
      this.context.onChange(values, meta);
    });
  };

  handleFieldRemove = async (key: string, event?: Event) => {
    if (event) {
      event.preventDefault();
    }

    const values = await cloneObj(this.state.values, { remove: key });

    this.setState({ values }, () => {
      this.context.onChange(values, { action: 'remove', key });
    });
  };

  handleFieldClear = async (key: string) => {
    const field = this.context.fieldConfig[key];
    const value = field.getInitialValue();
    const values = cloneObj(this.state.values, { add: { [key]: value } });

    this.setState({ values }, () => {
      this.handleIdleAnalyticsEvent(values);
      this.context.onChange(values, { action: 'clear', key });
    });
  };

  handleFieldChange = (key: string) => (value: *) => {
    const { fieldConfig } = this.context;
    const oldInvalid = this.state.invalid;
    const values = cloneObj(this.state.values, { add: { [key]: value } });

    const field = fieldConfig[key];
    const invalidMessage = field.validate(value);

    let invalid = oldInvalid;

    if (invalidMessage) {
      invalid = cloneObj(oldInvalid, { add: { [key]: invalidMessage } });
    } else if (oldInvalid[key]) {
      invalid = cloneObj(oldInvalid, { remove: key });
    }

    const liveUpdateStoredValues = () => {
      // don't commit changes to context if there's invalid keys
      if (invalid[key]) {
        return;
      }

      // avoid unnecessary calls
      if (values[key] === this.context.value[key]) {
        return;
      }

      const data = values[key];
      const meta = { action: 'update', key, data };

      this.handleIdleAnalyticsEvent(values);
      this.context.onChange(values, meta);
    };

    this.setState({ invalid, values }, liveUpdateStoredValues);
  };

  makeField = (config: Object) => (key: string) => {
    const fieldModel = this.context.fieldConfig[key];

    // Catch invalid configurations
    if (!fieldModel) {
      const likelySource = config.isRemovable ? 'value' : 'irremovableKeys';

      throw new Error(
        `Couldn't find a matching field config for key "${key}". There may be stale or invalid keys in \`${likelySource}\`.`,
      );
    }

    const { type, ...field } = fieldModel;
    const FieldView = type.view;

    // Catch missing views:
    // This should only really happen when developing a new field type
    if (!FieldView) {
      throw new Error(
        `Couldn't find the View (${type.name}) for key "${key}".`,
      );
    }

    const invalidMessage = this.state.invalid[key];
    const isInvalid = Boolean(invalidMessage);

    const initialValue = field.getInitialValue();
    const storedValue = this.context.value[key] || initialValue;
    const localValue = this.state.values[key] || initialValue;

    const hasPopup = typeof field.formatLabel === 'function';
    const popupIsOpen = this.getActivePopup() === key;

    const fieldUI = renderContextProps => {
      const extra = { ...config, ...renderContextProps };

      return (
        <FieldView
          closePopup={hasPopup ? this.closePopup : undefined}
          field={field}
          invalidMessage={invalidMessage}
          key={key}
          onClear={() => this.handleFieldClear(key)}
          onChange={this.handleFieldChange(key)}
          refinementBarValue={this.context.value}
          storedValue={storedValue}
          value={localValue}
          {...extra}
        />
      );
    };

    return hasPopup ? (
      <Popup
        key={key}
        innerRef={val => {
          // This could be tidier by just applying to FilterButton's ref, but
          // there's a bug in the version of react-popper (1.0.2) we're using
          // that results in infite set state calls.
          applyRef(this.props.refs[key], val);
        }}
        isOpen={popupIsOpen}
        onOpen={() => this.openPopup(key)}
        onClose={this.closePopup}
        allowClose={!isInvalid}
        target={({ isOpen, onClick, ref }: *) => (
          <FilterButton
            field={field}
            isInvalid={isInvalid}
            isSelected={isOpen}
            onClick={onClick}
            onClear={
              stringCompare(storedValue, initialValue)
                ? null
                : () => this.handleFieldClear(key)
            }
            ref={ref}
          >
            {field.formatLabel(storedValue)}
          </FilterButton>
        )}
      >
        {fieldUI}
      </Popup>
    ) : (
      fieldUI({ innerRef: this.props.refs[key] })
    );
  };

  onChangeFilter = (options: *, meta) => {
    this.closePopup();
    switch (meta.action) {
      case 'clear-options':
        options.forEach(o => this.handleFieldRemove(o.value));
        break;
      case 'select-option':
        this.handleFieldAdd(meta.option.value);
        break;
      case 'deselect-option':
        this.handleFieldRemove(meta.option.value);
        break;
      default:
    }
  };

  getFilterValue = memoize(keys => {
    return keys.map(this.mapKeyToOption);
  });

  showAll = isExpanded => () => {
    this.setState({ isExpanded }, () => {
      // NOTE: focus is managed manually here because the show/hide buttons are
      // removed from the DOM and the user should stay focused _somewhere_ in
      // the refinement bar
      const target = isExpanded
        ? this.showLessRef.current
        : this.showAllRef.current;

      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    });
  };

  mapKeyToOption = value => {
    const field = this.context.fieldConfig[value];
    const label = field.label || value;
    return { label, value }; // react-select expects this shape
  };

  shouldDisplayAddUI = () => {
    const { fieldKeys, irremovableKeys } = this.context;

    return !isEqualArr(fieldKeys, irremovableKeys);
  };

  render() {
    const { irremovableKeys, selectedKeys } = this.context;
    const { isExpanded } = this.state;
    const activePopupKey = this.getActivePopup();
    const FILTER_POPUP_KEY = '__refinement-bar-more-menu__';

    return (
      <Group>
        {irremovableKeys.map(this.makeField({ isRemovable: false }))}
        {isExpanded && selectedKeys.map(this.makeField({ isRemovable: true }))}

        {/* Show More/Less Control */}
        {!isExpanded && selectedKeys.length ? (
          <Button
            ref={this.showAllRef}
            onClick={this.showAll(true)}
            iconAfter={
              <Badge appearance="primary">{selectedKeys.length}</Badge>
            }
          >
            Show All
          </Button>
        ) : null}

        {/* Add Filter Popup */}
        {this.shouldDisplayAddUI() ? (
          <Popup
            onOpen={() => this.openPopup(FILTER_POPUP_KEY)}
            onClose={this.closePopup}
            isOpen={activePopupKey === FILTER_POPUP_KEY}
            target={({ isOpen, onClick, ref }: *) => (
              <Button
                appearance="link"
                iconBefore={<AddIcon />}
                ref={ref}
                isSelected={isOpen}
                onClick={onClick}
              >
                More
              </Button>
            )}
          >
            {({ scheduleUpdate }) => (
              <DialogInner minWidth={220}>
                <FilterManager
                  options={this.filterOptions}
                  onChange={this.onChangeFilter}
                  scheduleUpdate={scheduleUpdate}
                  value={this.getFilterValue(selectedKeys)}
                />
              </DialogInner>
            )}
          </Popup>
        ) : null}

        {isExpanded && selectedKeys.length ? (
          <Button
            ref={this.showLessRef}
            appearance="subtle-link"
            onClick={this.showAll(false)}
          >
            Show Less
          </Button>
        ) : null}
      </Group>
    );
  }
}

// ==============================
// Styled Components
// ==============================

// eslint-disable-next-line react/no-multi-comp
const Group = forwardRef(({ children }: *, ref) => {
  const gutter = 4;
  const childArray = Children.toArray(children).filter(Boolean); // filter out null and undefined children
  return (
    <div
      ref={ref}
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: -gutter,
      }}
    >
      {childArray.map((child, idx) => (
        <div css={{ margin: gutter, minWidth: 0 }} key={child.key || idx}>
          {child}
        </div>
      ))}
    </div>
  );
});

// ==============================
// Wrap with analytics
// ==============================

export const RefinementBarUI = withAnalyticsContext(defaultAttributes)(
  withAnalyticsEvents()(ActualRefinementBar),
);

type RefinementBarProps = CommonProps & Props;

const RefinementBar = ({
  activePopupKey,
  fieldConfig,
  irremovableKeys,
  onChange,
  onPopupClose,
  onPopupOpen,
  refs,
  value,
}: RefinementBarProps) => (
  <RefinementBarProvider
    fieldConfig={fieldConfig}
    irremovableKeys={irremovableKeys}
    onChange={onChange}
    value={value}
  >
    <RefinementBarUI
      activePopupKey={activePopupKey}
      onPopupOpen={onPopupOpen}
      onPopupClose={onPopupClose}
      refs={refs}
    />
  </RefinementBarProvider>
);

export default RefinementBar;
