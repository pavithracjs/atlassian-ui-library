interface TeamMentionState {
  seenCount: number;
  dontShow: boolean;
}

export const mentionSpotlightLocalStorageKey =
  'atlassian.people.context.mention.spotlight';

const EMPTY: TeamMentionState = {
  seenCount: 0,
  dontShow: false,
};

// Don't show if the user can't access local storage
const DISABLED_LOCAL_STORAGE: TeamMentionState = {
  seenCount: 99,
  dontShow: true,
};

const MAX_SEEN_LIMIT = 5;

export default class MentionSpotlightController {
  // Note - not a simple look up to avoid showing it to users that have local storage disabled
  private static readFromLocalStorage(): TeamMentionState {
    try {
      let localVal = localStorage.getItem(mentionSpotlightLocalStorageKey);

      if (!localVal) {
        // Attempt to write to see if the user has local storage access
        localStorage.setItem(
          mentionSpotlightLocalStorageKey,
          JSON.stringify(EMPTY),
        );
        localVal = localStorage.getItem(mentionSpotlightLocalStorageKey);
      }

      if (localVal) {
        return JSON.parse(localVal) as TeamMentionState;
      } else {
        return DISABLED_LOCAL_STORAGE;
      }
    } catch (err) {
      return DISABLED_LOCAL_STORAGE;
    }
  }

  private static saveToLocalStorage(item: TeamMentionState) {
    try {
      localStorage.setItem(
        mentionSpotlightLocalStorageKey,
        JSON.stringify(item),
      );
    } catch (err) {
      // do nothing
    }
  }

  private static markAsDone = () => {
    const item = MentionSpotlightController.readFromLocalStorage();
    item.dontShow = true;
    MentionSpotlightController.saveToLocalStorage(item);
  };

  static isSpotlightEnabled = () => {
    const item = MentionSpotlightController.readFromLocalStorage();
    return item.seenCount < MAX_SEEN_LIMIT && !item.dontShow;
  };

  static registerRender = (): TeamMentionState => {
    const item = MentionSpotlightController.readFromLocalStorage();
    item.seenCount += 1;
    if (item.seenCount > MAX_SEEN_LIMIT) {
      item.dontShow = true;
    }
    MentionSpotlightController.saveToLocalStorage(item);
    return item;
  };

  static getSeenCount = (): number => {
    return MentionSpotlightController.readFromLocalStorage().seenCount;
  };

  static registerCreateLinkClick = MentionSpotlightController.markAsDone;
  static registerTeamMention = MentionSpotlightController.markAsDone;
  static registerClosed = MentionSpotlightController.markAsDone;
}
