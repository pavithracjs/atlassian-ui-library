import MentionSpotlightController from '../../../components/MentionSpotlight/MentionSpotlightController';

describe('MentionSpotlightController', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return viewable when going from scratch', () => {
    const isEnabled = MentionSpotlightController.isSpotlightEnabled();
    expect(isEnabled).toBe(true);
  });

  it('should not be viewable after 5 renders', () => {
    // Four times is fine
    MentionSpotlightController.registerRender();
    MentionSpotlightController.registerRender();
    MentionSpotlightController.registerRender();
    MentionSpotlightController.registerRender();

    const isEnabledFour = MentionSpotlightController.isSpotlightEnabled();
    expect(isEnabledFour).toBe(true);

    // Fifth is not
    MentionSpotlightController.registerRender();
    const isEnabledFive = MentionSpotlightController.isSpotlightEnabled();
    expect(isEnabledFive).toBe(false);
  });

  it('should not be viewable after closing dialog', () => {
    MentionSpotlightController.registerClosed();
    const isEnabled = MentionSpotlightController.isSpotlightEnabled();
    expect(isEnabled).toBe(false);
  });

  it('should not be viewable after making a team mention', () => {
    MentionSpotlightController.registerTeamMention();
    const isEnabled = MentionSpotlightController.isSpotlightEnabled();
    expect(isEnabled).toBe(false);
  });

  it('should not be viewable after creating a team', () => {
    MentionSpotlightController.registerCreateLinkClick();
    const isEnabled = MentionSpotlightController.isSpotlightEnabled();
    expect(isEnabled).toBe(false);
  });

  it('should not be viewable after multple criteria met', () => {
    MentionSpotlightController.registerRender();
    MentionSpotlightController.registerClosed();
    MentionSpotlightController.registerCreateLinkClick();
    MentionSpotlightController.registerRender();

    const isEnabled = MentionSpotlightController.isSpotlightEnabled();
    expect(isEnabled).toBe(false);
  });
});
