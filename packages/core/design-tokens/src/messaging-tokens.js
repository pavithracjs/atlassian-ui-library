// @flow
import {
  B300,
  B400,
  B50,
  G200,
  G300,
  G400,
  G50,
  N0,
  N400,
  N500,
  N600,
  N700,
  P200,
  P300,
  P50,
  R300,
  R400,
  R50,
  Y200,
  Y300,
  Y50,
} from './options';

export default {
  colors: {
    text: {
      normal: {
        resting: N500,
        highlight: N600,
      },
      bold: {
        resting: N0,
      },
    },
    warning: {
      normal: {
        icon: {
          resting: Y300,
          highlight: Y200,
        },
        background: {
          resting: Y50,
        },
        text: {
          resting: N500,
        },
      },
      bold: {
        icon: {
          resting: N700,
        },
        background: {
          resting: Y300,
        },
        text: {
          resting: N700,
        },
      },
    },
    destructive: {
      normal: {
        icon: {
          resting: R400,
          highlight: R300,
        },
        background: {
          resting: R50,
        },
        text: {
          resting: N500,
        },
      },
      bold: {
        background: {
          resting: R400,
        },
        icon: {
          resting: N0,
        },
        text: {
          resting: N0,
        },
      },
    },
    info: {
      normal: {
        icon: {
          resting: B400,
          highlight: B300,
        },
        background: {
          resting: B50,
        },
        text: {
          resting: N500,
        },
      },
      bold: {
        icon: {
          resting: N0,
        },
        background: {
          resting: N400,
        },
        text: {
          resting: N0,
        },
      },
    },
    confirmation: {
      normal: {
        icon: {
          resting: G300,
          highlight: G200,
        },
        background: {
          resting: G50,
        },
        text: {
          resting: N500,
        },
      },
      bold: {
        icon: {
          resting: N0,
        },
        background: {
          resting: G400,
        },
        text: {
          resting: N0,
        },
      },
    },
    change: {
      normal: {
        icon: {
          resting: P300,
          highlight: P200,
        },
        background: {
          resting: P50,
        },
        text: {
          resting: N500,
        },
      },
      bold: {
        icon: {
          resting: N0,
        },
        background: {
          resting: P300,
          highlight: P200,
        },
        text: {
          resting: N0,
        },
      },
    },
  },
};
