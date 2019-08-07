import React from 'react';
import { HeadingAnchor } from '../../../../ui';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import Tooltip from '@atlaskit/tooltip';

describe('HeadingAnchor', () => {
  const onClick = () =>
    new Promise<void>((resolve, _reject) => {
      resolve();
    });
  let subject: any;

  afterEach(() => {
    if (subject) {
      subject.unmount();
    }
  });

  it('render tooltip with correct message initially', () => {
    subject = mountWithIntl(<HeadingAnchor onClick={onClick} />);
    expect(subject.find(Tooltip).exists()).toBeTruthy();
    expect(subject.find(Tooltip).props().content).toEqual(
      'Copy this anchor link',
    );
  });

  it('render tooltip with correct message after user clicked', async () => {
    let promise;
    const onClickCopyButton = () => {
      promise = Promise.resolve();
      return promise;
    };
    subject = mountWithIntl(<HeadingAnchor onClick={onClickCopyButton} />);
    subject.find('button').simulate('click');

    await promise;
    subject.update();

    expect(subject.find(Tooltip).props().content).toEqual('Copied!');
  });
});
