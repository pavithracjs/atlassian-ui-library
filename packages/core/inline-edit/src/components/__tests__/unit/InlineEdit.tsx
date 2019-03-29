import * as React from 'react';
import { mount } from 'enzyme';
import InlineEditableTextfield from '../../InlineEditableTextfield';
import InlineEditUncontrolled from '../../InlineEditUncontrolled';

import ContentWrapper from '../../../styled/ContentWrapper';
import EditButton from '../../../styled/EditButton';
import ReadViewContainer from '../../../styled/ReadViewContainer';
import ReadViewContentWrapper from '../../../styled/ReadViewContentWrapper';
import ReadViewWrapper from '../../../styled/ReadViewWrapper';

const noop = () => {};

describe('@atlaskit/inline-edit core', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should render a label when label prop is passed', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" label="test" />,
    );
    expect(wrapper.find('label').length).toBe(1);
  });

  it('should not render a label when label prop is not passed', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find('label').length).toBe(0);
  });

  it('should keep edit view open on blur when keepEditViewOpenOnBlur prop is true', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
        keepEditViewOpenOnBlur
      />,
    );
    const div = wrapper.find(ContentWrapper);
    div.simulate('blur');
    jest.runOnlyPendingTimers();
    expect(wrapper.find('input').length).toBe(1);
    expect(spy).not.toBeCalled();
  });

  it('should render action buttons', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    expect(wrapper.find('button').length).toBe(2);
  });

  it('should not render action buttons when hideActionButtons prop is true', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        startWithEditViewOpen
        hideActionButtons
      />,
    );
    expect(wrapper.find('button').length).toBe(0);
  });

  it('should stretch to container width in read mode if readViewFitContainerWidth prop is true', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        readViewFitContainerWidth
      />,
    );
    expect(wrapper.find(ReadViewContentWrapper)).toHaveStyleRule(
      'width',
      '100%',
    );
  });

  it('should display readView', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(ReadViewContainer).length).toBe(1);
  });

  it('should render a button as a sibling to the read view', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(ReadViewWrapper).find('button').length).toBe(1);
    expect(wrapper.find(ReadViewContentWrapper).find('button').length).toBe(0);
  });

  it('should display editView with correct initial value when isEditing prop is true', () => {
    /**
     * This test uses the startWithEditViewOpen prop to set the isEditing prop
     * to true within InlineEditableTextfield
     */
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue="test"
        startWithEditViewOpen
      />,
    );
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').prop('value')).toBe('test');
  });

  it('should switch to editView when the read view is clicked', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(false);
    wrapper.find(ReadViewContentWrapper).simulate('click');
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(true);
  });

  it('should switch to editView when the edit button is focused and enter is pressed', () => {
    /** This test uses simulate('click') to simulate a keydown of Enter on the edit button */
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(false);
    wrapper.find(EditButton).simulate('click');
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(true);
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    expect(wrapper.find('button[type="submit"]').length).toBe(1);
    wrapper.find('form').simulate('submit');
    expect(spy).toBeCalled();
    expect(wrapper.find('input').length).toBe(0);
  });

  it('should cancel the edit and return to the initial value when cancel button is pressed', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    wrapper.find('input').simulate('change', { target: { value: 'Hello' } });
    wrapper.find('button[aria-label="Cancel"]').simulate('click');
    expect(wrapper.find(ReadViewContainer).length).toBe(1);
    expect(spy).not.toBeCalled();
    wrapper.find(EditButton).simulate('click');
    expect(wrapper.find('input').prop('value')).toBe('');
  });

  it('should cancel the edit and return to the initial value when Escape key is pressed', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Hello' } });
    input.simulate('keyDown', { key: 'Esc' });
    expect(wrapper.find(ReadViewContainer).length).toBe(1);
    expect(spy).not.toBeCalled();
    wrapper.find(EditButton).simulate('click');
    expect(wrapper.find('input').prop('value')).toBe('');
  });

  it('should call onConfirm on blur', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    const div = wrapper.find(ContentWrapper);
    div.simulate('blur');
    jest.runOnlyPendingTimers();
    expect(spy).toBeCalled();
  });

  // it('should have default aria-tags', () => {
  //   const wrapper = mount(
  //     <InlineEditableTextfield
  //       onConfirm={spy}
  //       defaultValue=""
  //       startWithEditViewOpen
  //     />,
  //   );
  //   const div = wrapper.find(ContentWrapper);
  //   div.simulate('blur');
  //   jest.runOnlyPendingTimers();
  //   expect(spy).toBeCalled();
  // });

  // it('should pass through label props to aria tags', () => {

  // });

  // it('validate');
});

// describe('@atlaskit/inline-editable-textfield', () => {
//   it('emptyValueText')

//   it('readView correct value');

//   it('not cause console errors')

// })

// describe('@atlaskit/inline-edit', () => {
//   it('readView');

//   it('editView');
// });

// describe('uncontrolled?')

describe('@atlaskit/inline-edit', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should mount without errors', () => {
    mount(<InlineEditableTextfield onConfirm={noop} defaultValue="" />);
    /* tslint:disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* tslint:disable no-console */
  });
});

// const noop = () => {};
// const Input = props => <input {...props} onChange={noop} />;

// const defaultProps = {
//   isEditing: false,
//   onConfirm: noop,
//   readView: 'readView',
//   editView: <Input value="test" />,
// };

// describe('@atlaskit/inline-edit', () => {
//   it('should render read view with EditButton as a sibling', () => {
//     const readView = <span>read</span>;
//     const wrapper = mount(<InlineEdit {...defaultProps} readView={readView} />);
//     expect(wrapper.find(FieldBase).length).toBe(1);
//     const fieldBase = wrapper.find(FieldBase);
//     expect(fieldBase.contains(readView)).toBe(true);
//   });

//   it('should render edit view and not read view when in editing mode', () => {
//     const editView = <span>edit</span>;
//     const wrapper = mount(
//       <InlineEditUncontrolled
//         {...defaultProps}
//         isEditing
//         editView={editView}
//       />,
//     );
//     expect(wrapper.find(FieldBase).length).toBe(1);
//     const fieldBase = wrapper.find(FieldBase);
//     expect(fieldBase.contains(editView)).toBe(true);
//   });

//   describe('onEditRequested', () => {
//     it('should be called when the read view is clicked', () => {
//       const spy = jest.fn();
//       const wrapper = mount(
//         <InlineEditUncontrolled {...defaultProps} onEditRequested={spy} />,
//       );
//       wrapper.find(FieldBase).simulate('click');
//       expect(spy).toHaveBeenCalled();
//     });

//     it('should not be called when the edit view is clicked', () => {
//       const spy = jest.fn();
//       const wrapper = mount(
//         <InlineEditUncontrolled
//           {...defaultProps}
//           isEditing
//           onEditRequested={spy}
//         />,
//       );
//       wrapper.find(FieldBase).simulate('click');
//       expect(spy).not.toHaveBeenCalled();
//     });
//   });

//   describe('onConfirm', () =>
//     it('should be called when confirmation button is clicked', () => {
//       const spy = jest.fn();
//       const wrapper = mount(
//         <InlineEditUncontrolled {...defaultProps} isEditing onConfirm={spy} />,
//       );
//       wrapper
//         .find(Button)
//         .first()
//         .simulate('click');
//       expect(spy).toHaveBeenCalled();
//     }));

//   describe('onCancel', () =>
//     it('should be called when cancel button is clicked', () => {
//       const spy = jest.fn();
//       const wrapper = mount(
//         <InlineEditUncontrolled {...defaultProps} isEditing onCancel={spy} />,
//       );
//       wrapper
//         .find(Button)
//         .last()
//         .simulate('click');
//       expect(spy).toHaveBeenCalled();
//     }));

//   describe('label', () => {
//     it('should set parameter into FieldBase', () => {
//       expect(
//         shallow(<InlineEditUncontrolled {...defaultProps} label="test" />)
//           .find(Label)
//           .prop('label'),
//       ).toBe('test');
//     });

//     it('should set both isLabelHidden and label parameter into FieldBase', () => {
//       const wrapper = shallow(
//         <InlineEditUncontrolled {...defaultProps} label="test" isLabelHidden />,
//       );
//       const fieldBase = wrapper.find(Label);
//       expect(fieldBase.prop('label')).toBe('test');
//       expect(fieldBase.prop('isLabelHidden')).toBe(true);
//     });

//     it('it should not call onClick if is read only', () => {
//       const spy = jest.fn();
//       const wrapper = mount(
//         <InlineEditUncontrolled
//           {...defaultProps}
//           label="test"
//           onEditRequested={spy}
//           editView={undefined}
//         />,
//       );
//       const label = wrapper.find(Label);
//       /**
//        * We cannot use simulate here since the node that has the event handler is inside Label.
//        *
//        * Otherwise we will be exposing implementation details from FieldBase and also
//        * we would be coupling this test to the current structure of FieldBase.
//        *
//        * So instead, we find the first node inside Label that has `onClick` and that it's not
//        * the Label itself, and then we simulate the event on that node.
//        **/
//       const onClickNode = label
//         .findWhere(n => n.prop('onClick') && !n.find(Label).exists())
//         .at(0);
//       onClickNode.simulate('click');
//       expect(spy).not.toHaveBeenCalled();
//     });
//   });

//   describe('isWaiting', () => {
//     describe('when isEditing is false', () =>
//       it('FieldBase should not have isLoading prop', () => {
//         const wrapper = mount(
//           <InlineEditUncontrolled {...defaultProps} isWaiting />,
//         );
//         expect(wrapper.find(FieldBase).prop('isLoading')).toBe(false);
//       }));

//     describe('when isEditing is true', () => {
//       let wrapper;

//       beforeEach(() => {
//         wrapper = shallow(
//           <InlineEditUncontrolled {...defaultProps} isWaiting isEditing />,
//         );
//       });

//       it('FieldBase should have prop isLoading', () =>
//         expect(wrapper.find(FieldBase).prop('isLoading')).toBe(true));

//       it('should disable field base', () =>
//         expect(wrapper.find(FieldBase).prop('isDisabled', true)).not.toBe(
//           undefined,
//         ));
//     });
//   });

//   describe('disableEditViewFieldBase', () => {
//     it('should not wrap editView in a FieldBase when set to true', () => {
//       const wrapper = mount(
//         <InlineEditUncontrolled
//           {...defaultProps}
//           isEditing
//           disableEditViewFieldBase
//         />,
//       );

//       expect(wrapper.find(FieldBase).length).toBe(0);
//     });

//     it('should wrap editView in a FieldBase when set to false', () => {
//       const wrapper = mount(
//         <InlineEditUncontrolled
//           {...defaultProps}
//           isEditing
//           disableEditViewFieldBase={false}
//         />,
//       );

//       expect(wrapper.find(FieldBase).length).toBe(1);
//     });

//     it('should default to false', () => {
//       const wrapper = mount(
//         <InlineEditUncontrolled {...defaultProps} isEditing />,
//       );

//       expect(wrapper.prop('disableEditViewFieldBase')).toBe(false);
//     });
//   });

//   describe('invalidMessage prop', () => {
//     it('should be reflected to the FieldBase', () => {
//       expect(
//         shallow(
//           <InlineEditUncontrolled {...defaultProps} invalidMessage="test" />,
//         )
//           .find(FieldBase)
//           .props().invalidMessage,
//       ).toBe('test');
//     });
//   });

//   describe('isInvalid prop', () => {
//     it('should be reflected to the FieldBase', () => {
//       expect(
//         shallow(<InlineEditUncontrolled {...defaultProps} isInvalid />)
//           .find(FieldBase)
//           .props().isInvalid,
//       ).toBe(true);
//     });
//   });

//   /* This suite can be enabled when we move to styled components v2 (new repo?) and we
//    * can properly use jest-styled-components without disabling mount(...) calls
//    */
//   // eslint-disable-next-line jest/no-disabled-tests
//   describe('field width', () => {
//     it('should not stretch to container width in read mode by default', () => {
//       const wrapper = mount(<InlineEditUncontrolled {...defaultProps} />);

//       expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
//         'display',
//         'inline-block',
//       );
//     });

//     it('should stretch to container width in read mode when isFitContainerWidthReadView is set', () => {
//       const wrapper = mount(
//         <InlineEditUncontrolled
//           {...defaultProps}
//           isFitContainerWidthReadView
//         />,
//       );

//       expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
//         'display',
//         'block',
//       );
//     });

//     it('should stretch to container width when in edit mode', () => {
//       const wrapper = mount(
//         <InlineEditUncontrolled {...defaultProps} isEditing />,
//       );

//       expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
//         'display',
//         'block',
//       );
//     });

//     it('should have max-width so inline-block text overflow using ellipses', () => {
//       const wrapper = mount(<InlineEditUncontrolled {...defaultProps} />);

//       expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
//         'max-width',
//         '100%',
//       );
//     });
//   });
// });

// describe('InlineEditStatelessWithAnalytics', () => {
//   beforeEach(() => {
//     jest.spyOn(global.console, 'warn');
//     jest.spyOn(global.console, 'error');
//   });
//   afterEach(() => {
//     global.console.warn.mockRestore();
//     global.console.error.mockRestore();
//   });

//   it('should mount without errors', () => {
//     const readView = <span>read</span>;
//     mount(
//       <InlineEditStatelessWithAnalytics
//         {...defaultProps}
//         readView={readView}
//       />,
//     );
//     /* eslint-disable no-console */
//     expect(console.warn).not.toHaveBeenCalled();
//     expect(console.error).not.toHaveBeenCalled();
//     /* eslint-enable no-console */
//   });
// });
