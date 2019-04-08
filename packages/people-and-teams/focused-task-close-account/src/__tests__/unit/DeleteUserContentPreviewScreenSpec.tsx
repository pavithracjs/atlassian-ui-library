import * as React from 'react';
import { shallow } from 'enzyme';
import { DeleteUserContentPreviewScreen } from '../../components/DeleteUserContentPreviewScreen';
import { catherineHirons } from '../../mocks/users';
import { DeleteUserContentPreviewScreenProps } from '../../components/DeleteUserContentPreviewScreen/types';

const defaultProps: DeleteUserContentPreviewScreenProps = {
  isCurrentUser: false,
  user: catherineHirons,
  preferenceSelection: (name: string) => jest.fn(),
};

const render = (props = {}) =>
  shallow(<DeleteUserContentPreviewScreen {...defaultProps} {...props} />);

test('DeleteUserContentPreviewScreen', () => {
  expect(render()).toMatchSnapshot();
});

describe('selectAdminOrSelfCopy', () => {
  test('selects admin copy if delete candidate is not current user', () => {
    const selectAdminOrSelfCopy = (render({
      isCurrentUser: false,
    }).instance() as DeleteUserContentPreviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin' as any, 'self' as any)).toBe('admin');
  });

  test('selects self copy if delete candidate is current user', () => {
    const selectAdminOrSelfCopy = (render({
      isCurrentUser: true,
    }).instance() as DeleteUserContentPreviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin' as any, 'self' as any)).toBe('self');
  });
});

describe('handleClickSelection', () => {
  test('changes the isSelected parameter of the element', () => {
    const wrapper = render();
    const divWrapper = wrapper.find('.nameSectionCard');
    shallow(<div>{divWrapper}</div>)
      .childAt(0)
      .simulate('click');
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
