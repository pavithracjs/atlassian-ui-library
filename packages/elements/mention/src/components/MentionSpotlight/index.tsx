import * as React from 'react';

export interface Props {
  /** Decides whether component should be rendered or not. This logic could have been implemented by passing
   * `query` as a prop and checking whether it changed. But `editor-core` does not update props, it always
   * remounts a new instance. So that approach will not work in `editor-core`. So calculating show/hide state
   * should be done external to this component (use function `shouldShowMentionSpotlight` at the end of this file)
   */
  showComponent: boolean;
  createTeamLink: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
}

export default class MentionSpotlight extends React.Component<Props, {}> {
  render() {
    const { showComponent, onClose } = this.props;

    if (!showComponent) {
      return null;
    }

    return (
      <>
        <div>I am SPOTLIGHT!</div>
        <div onClick={onClose}>CLOSE</div>
      </>
    );
  }
}

export const shouldShowMentionSpotlight = (
  componentIsShownNow: boolean,
  queryLengthToHideSpotlight: number,
  queryChanged: boolean,
  query?: String,
) => {
  // Do not try to hide the component if the component is already hidden
  // Do not try to hide the component if the query hasn't changed
  if (componentIsShownNow && queryChanged) {
    if (query && query.length >= queryLengthToHideSpotlight) {
      return false;
    }
  }

  // keep the component visibility as it is
  return componentIsShownNow;
};
