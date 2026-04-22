import track2 from "../assets/images/raimond-klavins-xAqrT-279UA-unsplash.jpg";

const freedomFlexibilityPathData = {
  trackId: "freedom-flexibility-path",
  progressStorageKey: "freedom-flexibility-progress",
  hero: {
    title: "Freedom & Flexibility Path",
    subheading: "Build wealth without locking yourself in too early",
    src: track2,
    alt: "Open road and mountain landscape",
  },
  intro: {
    tag: "Freedom & Flexibility Path",
    description:
      "This path is for users who value mobility, experiences, and career agility over locking themselves into long-term commitments too early. It focuses on building flexibility through liquid savings, lower debt, and strong cash flow.",
  },
  priorities: {
    title: "Key Priorities",
    items: [
      "Building a strong 6-12 month emergency fund",
      "Keeping investments liquid and flexible",
      "Avoiding high debt and lifestyle inflation",
      "Protecting your ability to adapt and move",
    ],
  },
  milestonesSectionTitle: "5-year roadmap",
  milestones: [
    {
      number: 1,
      progressKey: "emergencyFund",
      year: "Years 1-2",
      title: "Build a 6-month emergency fund",
      description:
        "Start with a safety buffer that protects your options and gives you breathing room when life changes.",
    },
    {
      number: 2,
      progressKey: "tfsaSetup",
      year: "Years 1-2",
      title: "Automate your tax-free savings",
      description:
        "Set up consistent saving into a TFSA or other flexible vehicle so your money begins working while staying aligned to this path.",
    },
    {
      number: 3,
      progressKey: "freedomFund",
      year: "Year 3",
      title: "Create a Freedom Fund",
      description:
        "Build a dedicated reserve for travel, relocation, a passion project, or a career break.",
    },
    {
      number: 4,
      progressKey: "flexibleInvesting",
      year: "Years 4-5",
      title: "Strengthen long-term flexibility",
      description:
        "Grow your emergency fund toward 12 months and diversify into more flexible or offshore investments.",
    },
  ],
  accordion: {
    title: "Did you know?",
    items: [
      {
        title: "What does liquidity actually mean?",
        content:
          "Liquidity means how quickly you can access your money when life changes. This path values flexibility, which means keeping enough money reachable when opportunities or emergencies come up.",
      },
      {
        title: "Why low debt matters here",
        content:
          "Debt creates fixed obligations. The more monthly commitments you carry, the harder it becomes to relocate, travel, take a break, or respond to unexpected changes.",
      },
      {
        title: "Why an emergency fund is central",
        content:
          "A 6-12 month emergency fund acts like freedom insurance. It helps you stay calm during job changes, career pivots, travel plans, or periods of uncertainty.",
      },
      {
        title: "Why this path can still build wealth",
        content:
          "Freedom and flexibility does not mean avoiding wealth-building. It means building wealth in ways that stay accessible, portable, and adaptable to changing goals.",
      },
      {
        title: "What trade-off comes with this path",
        content:
          "You may delay traditional milestones like home ownership, and sometimes feel behind peers who buy assets early. But in return, you protect your ability to move and choose differently later.",
      },
    ],
  },
  sidebar: {
    tradeOffsTitle: "Trade-offs to understand",
    tradeOffs: [
      "Property ownership may be delayed.",
      "Wealth may feel less visible than traditional asset ownership.",
      "You may feel behind peers who buy homes earlier.",
    ],
    studios: [
      {
        title: "BNPL vs Save First",
        path: "/simulation-lab/bnpl-vs-save-first",
        description:
          "Compare convenience spending with slower, more flexible choices.",
      },
      {
        title: "Vehicle Finance Calculator",
        path: "/simulation-lab/vehicle-finance-calculator",
        description:
          "Check if vehicle debt is quietly reducing your freedom.",
      },
    ],
  },
  defaultProgress: {
    emergencyFund: "not-started",
    tfsaSetup: "not-started",
    freedomFund: "not-started",
    flexibleInvesting: "not-started",
  },
  messages: {
    applied:
      "You've applied Freedom & Flexibility Path as your active strategy track.",
    alreadyActive:
      "You already have an active strategy track. Untrack it first before applying a new one.",
    untracked: "Freedom & Flexibility Path has been untracked.",
    defaultTip:
      "Complete your financial setup to unlock more personalised flexibility tips.",
  },
};

export default freedomFlexibilityPathData;