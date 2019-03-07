import * as sinon from 'sinon';
import * as React from 'react';
import { mount } from 'enzyme';

import ToneSelector from '../../../../components/common/ToneSelector';
import EmojiButton from '../../../../components/common/EmojiButton';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
} from '../../../../types';
import { imageEmoji, generateSkinVariation } from '../../_test-data';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  toneSelectedEvent,
  toneSelectorOpenedEvent,
} from '../../../../analytics';

const baseHandEmoji: EmojiDescription = {
  ...imageEmoji,
  id: 'raised_back_of_hand',
  shortName: ':raised_back_of_hand:',
};

const handEmoji: EmojiDescriptionWithVariations = {
  ...baseHandEmoji,
  skinVariations: [
    generateSkinVariation(baseHandEmoji, 1),
    generateSkinVariation(baseHandEmoji, 2),
    generateSkinVariation(baseHandEmoji, 3),
    generateSkinVariation(baseHandEmoji, 4),
    generateSkinVariation(baseHandEmoji, 5),
  ],
};

describe('<ToneSelector />', () => {
  it('should display one emoji per skin variations + default', () => {
    const onToneSelectedSpy = sinon.spy();
    const wrapper = mount(
      <ToneSelector emoji={handEmoji} onToneSelected={onToneSelectedSpy} />,
    );

    expect(wrapper.find(EmojiButton)).toHaveLength(6);
  });

  it('should call onToneSelected on click', () => {
    const onToneSelectedSpy = sinon.spy();

    const wrapper = mount(
      <ToneSelector emoji={handEmoji} onToneSelected={onToneSelectedSpy} />,
    );

    wrapper
      .find(EmojiButton)
      .first()
      .simulate('mousedown', { button: 0 });
    expect(onToneSelectedSpy.calledWith(0)).toEqual(true);
  });

  it('should fire all relevant analytics', () => {
    const onEvent = sinon.stub();
    const onToneSelectedSpy = sinon.spy();

    const wrapper = mount(
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <ToneSelector emoji={handEmoji} onToneSelected={onToneSelectedSpy} />
      </AnalyticsListener>,
    );

    // Check opening event
    expect(onEvent.getCall(0).args[0]).toHaveProperty(
      'payload',
      toneSelectorOpenedEvent({}),
    );

    // Select a tone
    wrapper
      .find(EmojiButton)
      .first()
      .simulate('mousedown', { button: 0 });
    expect(onEvent.getCall(1).args[0]).toHaveProperty(
      'payload',
      toneSelectedEvent({ skinToneModifier: 'default' }),
    );

    // Unmount to trigger close event
    wrapper.unmount();
    expect(onEvent.callCount).toBe(2);
  });
});
