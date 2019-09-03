import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';

import {
  CardActionsView,
  CardActionIconButton,
  CardActionsDropdownMenu,
} from '../../cardActions';
import { CardActionButton } from '../../cardActions/styled';
import { CardAction } from '../../../actions';
import PreventClickThrough from '../../preventClickThrough';
import { formatAnalyticsEventActionLabel } from '../../../utils/cardActions/analyticsHelper';

describe('CardActions', () => {
  const openAction = {
    label: 'Open',
    handler: jest.fn(),
  };
  const closeAction = {
    label: 'Close',
    handler: jest.fn(),
  };
  const annotateAction = {
    label: 'Annotate',
    handler: jest.fn(),
    icon: <AnnotateIcon size="small" label="annotate" />,
  };
  const deleteAction = {
    label: 'Delete',
    handler: jest.fn(),
    icon: <CrossIcon size="small" label="delete" />,
  };

  const menuActions = [openAction, closeAction, annotateAction, deleteAction];

  const openDropdownMenuIfExists = (card: ReactWrapper) => {
    const dropdownMenu = card.find(DropdownMenu);
    if (dropdownMenu.length > 0) {
      dropdownMenu.find(CardActionButton).simulate('click');
    }
  };

  const setup = (
    actions: CardAction[],
    triggerColor?: string,
    analyticsHandler: any = false,
  ) => {
    const TheCardActionsView = () => (
      <CardActionsView actions={actions} triggerColor={triggerColor} />
    );
    const card = mount(
      analyticsHandler ? (
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <TheCardActionsView />
        </AnalyticsListener>
      ) : (
        <TheCardActionsView />
      ),
    );
    openDropdownMenuIfExists(card);

    const iconButtons = card.find(CardActionIconButton);
    const dropdownMenu = card.find(CardActionsDropdownMenu);
    const dropdownItems = dropdownMenu.find(DropdownItem);

    return {
      card,
      iconButtons,
      dropdownMenu,
      dropdownItems,
    };
  };

  it('should render nothing given no actions', () => {
    const { card } = setup([]);

    expect(card.find(PreventClickThrough)).toHaveLength(0);
  });

  /* Disabled because Dropdown now defers rendering children until layer is positioned. Integration test will replace these https://ecosystem.atlassian.net/browse/AK-5183
  it('should render only dropdown menu given one action with no icon', () => {
    const { iconButtons, dropdownMenu, dropdownItems } = setup([openAction]);

    expect(iconButtons).toHaveLength(0);
    expect(dropdownMenu).toHaveLength(1);
    expect(dropdownItems).toHaveLength(1);
    expect(dropdownItems.prop('children')).toEqual(openAction.label);

    expect(openAction.handler).not.toHaveBeenCalled();
  });

  it('should render only dropdown menu given multiple actions with no icon', () => {
    const { iconButtons, dropdownMenu, dropdownItems } = setup([
      openAction,
      closeAction,
    ]);

    expect(iconButtons).toHaveLength(0);
    expect(dropdownMenu).toHaveLength(1);
    expect(dropdownItems).toHaveLength(2);
  });
  */
  it('should render only icon button given one action with an icon', () => {
    const triggerColor = 'some-trigger-color';
    const { iconButtons, dropdownMenu, dropdownItems } = setup(
      [annotateAction],
      triggerColor,
    );

    expect(iconButtons).toHaveLength(1);
    const actionButton = iconButtons.find(CardActionButton);
    expect(actionButton.find(AnnotateIcon)).toHaveLength(1);
    expect(actionButton.prop('style')).toEqual({ color: triggerColor });
    expect(dropdownMenu).toHaveLength(0);
    expect(dropdownItems).toHaveLength(0);
  });

  it('should render two icon button given two actions with an icon', () => {
    const { iconButtons, dropdownMenu, dropdownItems } = setup([
      annotateAction,
      deleteAction,
    ]);

    expect(iconButtons).toHaveLength(2);
    expect(dropdownMenu).toHaveLength(0);
    expect(dropdownItems).toHaveLength(0);
  });

  /* Disabled because Dropdown now defers rendering children until layer is positioned. Integration test will replace these https://ecosystem.atlassian.net/browse/AK-5183
  it('should render one icon button and a dropdown menu given more than two actions', () => {
    const { iconButtons, dropdownMenu, dropdownItems } = setup(menuActions);

    expect(iconButtons).toHaveLength(1);
    expect(dropdownMenu).toHaveLength(1);
    expect(dropdownItems).toHaveLength(3);
  });
  */

  it('should call onToggle callback when dropdown menu trigger is clicked', () => {
    const onToggle = jest.fn();
    const card = mount(
      <CardActionsView actions={menuActions} onToggle={onToggle} />,
    );

    card
      .find(DropdownMenu)
      .find(CardActionButton)
      .simulate('click');

    expect(onToggle).toHaveBeenCalled();
  });

  it('should call action handler when icon button is pressed', () => {
    const triggerColor = 'some-color-string';
    const { iconButtons } = setup([annotateAction], triggerColor);

    iconButtons.simulate('click');

    expect(annotateAction.handler).toHaveBeenCalled();
  });
  /* Disabled because Dropdown now defers rendering children until layer is positioned. Integration test will replace these https://ecosystem.atlassian.net/browse/AK-5183
  it('should call action handler when item is pressed', () => {
    const triggerColor = 'some-color-string';
    const { dropdownItems } = setup([openAction], triggerColor);

    dropdownItems.simulate('click');

    expect(openAction.handler).toHaveBeenCalled();
  });
  */

  it('should pass supplied trigger color to dropdown menu trigger when there are multiple actions', () => {
    const triggerColor = 'some-color-string';
    const { dropdownMenu } = setup(menuActions, triggerColor);
    const trigger = dropdownMenu.find(CardActionButton);

    expect(trigger.prop('style')).toMatchObject({ color: triggerColor });
  });

  it('should pass supplied trigger color to delete button when there is a single action', () => {
    const triggerColor = 'some-color-string';
    const { iconButtons } = setup([deleteAction], triggerColor);

    expect(iconButtons.prop('triggerColor')).toEqual(triggerColor);
  });

  it('should fire analytics event on every clicked action and dropdown menu', async () => {
    const analyticsEventHandler = jest.fn();
    const clickIconButton = (card: ReactWrapper, at: number) =>
      card
        .find(CardActionIconButton)
        .at(at)
        .simulate('click');
    const clickDropdownItem = (card: ReactWrapper, at: number) =>
      card
        .find(DropdownMenu)
        .find(DropdownItem)
        .at(at)
        .simulate('click');

    const matchActionPayload = (
      actions: CardAction[],
      callNumber: number,
      actionPosition: number,
    ) =>
      expect(
        (analyticsEventHandler.mock.calls[callNumber][0] as UIAnalyticsEvent)
          .payload,
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: formatAnalyticsEventActionLabel(
          actions[actionPosition].label,
        ),
      });

    const matchMenuPayload = (callNumber: number) =>
      expect(
        (analyticsEventHandler.mock.calls[callNumber][0] as UIAnalyticsEvent)
          .payload,
      ).toMatchObject({ actionSubjectId: 'mediaCardDropDownMenu' });

    // 2 Action Buttons. No Dropdown Items
    const twoActions = [annotateAction, deleteAction];
    const { card: card1 } = setup(twoActions, undefined, analyticsEventHandler);
    clickIconButton(card1, 0); // call 0 - action 0
    clickIconButton(card1, 1); // call 1 - action 1

    // 1 Action Button. 3 Dropdown Items
    const fourActions = [annotateAction, openAction, deleteAction, closeAction];
    const { card: card2 } = setup(
      fourActions,
      undefined,
      analyticsEventHandler,
    );
    // Click in dropdown from setup   // call 2 - open dropdown
    clickIconButton(card2, 0); // call 3 - action 0
    clickDropdownItem(card2, 0); // call 4 - action 1
    openDropdownMenuIfExists(card2); // call 5 - Reopen dropdown
    clickDropdownItem(card2, 1); // call 6 - action 2
    openDropdownMenuIfExists(card2); // call 7 - Reopen dropdown
    clickDropdownItem(card2, 2); // call 8 - action 3

    expect(analyticsEventHandler).toBeCalledTimes(9);
    // 2 Action Buttons. No Dropdown Items
    matchActionPayload(twoActions, 0, 0); // call 0 - action 0
    matchActionPayload(twoActions, 1, 1); // call 1 - action 1
    // 1 Action Button. 3 Dropdown Items
    matchMenuPayload(2); // call 2 - open dropdown
    matchActionPayload(fourActions, 3, 0); // call 3 - action 0
    matchActionPayload(fourActions, 4, 1); // call 4 - action 1
    matchMenuPayload(5); // call 5 - Reopen dropdown
    matchActionPayload(fourActions, 6, 2); // call 6 - action 2
    matchMenuPayload(7); // call 7 - Reopen dropdown
    matchActionPayload(fourActions, 8, 3); // call 8 - action 3
  });
});
