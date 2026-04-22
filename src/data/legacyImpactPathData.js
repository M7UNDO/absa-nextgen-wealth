import track3 from "../assets/images/lawrence-crayton-FgwrW7wagzI-unsplash.jpg";

const legacyImpactPathData = {
  trackId: "legacy-impact-path",
  progressStorageKey: "legacy-impact-progress",
  hero: {
    title: "Legacy & Impact Path",
    subheading: "Build wealth that protects others and lasts beyond you",
    src: track3,
    alt: "Community and long-term impact",
  },
  intro: {
    tag: "Legacy & Impact Path",
    description:
      "This path is for users who want to build wealth that supports family, future generations, or long-term community impact. It focuses on protection, planning, and building structures that can outlast short-term spending.",
  },
  priorities: {
    title: "Key Priorities",
    items: [
      "Building generational wealth through long-term assets",
      "Putting protection structures in place early",
      "Planning for family support and future impact",
      "Balancing growth, stability, and responsibility",
    ],
  },
  milestonesSectionTitle: "5-year roadmap",
  milestones: [
    {
      number: 1,
      progressKey: "protectionSetup",
      year: "Year 1",
      title: "Protect the foundation",
      description:
        "Put life insurance in place, create a will, and build an emergency fund.",
    },
    {
      number: 2,
      progressKey: "educationFund",
      year: "Year 2",
      title: "Start future-focused investing",
      description:
        "Begin an education fund and start offshore or diversified long-term investing.",
    },
    {
      number: 3,
      progressKey: "growthAssets",
      year: "Year 3",
      title: "Grow meaningful assets",
      description:
        "Work toward a first investment property or a significant long-term equity portfolio.",
    },
    {
      number: 4,
      progressKey: "legacyStructures",
      year: "Years 4-5",
      title: "Formalise legacy structures",
      description:
        "Explore establishing a trust and review your net worth, beneficiaries, and long-term structures.",
    },
  ],
  accordion: {
    title: "Did you know?",
    items: [
      {
        title: "Why a will matters early",
        content:
          "A will is not only for later life. It helps make sure your assets go to the people and causes you choose, instead of leaving those decisions uncertain.",
      },
      {
        title: "Protection before growth",
        content:
          "Legacy starts with reducing vulnerability. Life cover, an emergency fund, and proper planning protect the people who may depend on you.",
      },
      {
        title: "Impact is more than donations",
        content:
          "Impact can include helping fund education, supporting family members sustainably, or building assets that create security across generations.",
      },
      {
        title: "Why offshore and equity exposure matter",
        content:
          "Long-term wealth often benefits from diversified growth. Offshore exposure and equities can help a legacy strategy grow beyond one local context over time.",
      },
      {
        title: "What legacy building can cost you",
        content:
          "This path may slow personal consumption in the short term. It often asks you to choose long-term structure and protection over immediate lifestyle upgrades.",
      },
    ],
  },
  sidebar: {
    tradeOffsTitle: "Trade-offs to understand",
    tradeOffs: [
      "Family responsibilities can place pressure on cash flow.",
      "Some investment choices may feel conservative in the short term.",
      "Personal consumption may grow more slowly while you build long-term structures.",
    ],
    studios: [
      {
        title: "Home Loan Calculator",
        path: "/simulation-lab/home-loan-calculator",
        description:
          "Explore whether property fits into your long-term legacy plan.",
      },
      {
        title: "Vehicle Finance Calculator",
        path: "/simulation-lab/vehicle-finance-calculator",
        description:
          "Check whether car debt is weakening your long-term wealth-building capacity.",
      },
      {
        title: "BNPL vs Save First",
        path: "/simulation-lab/bnpl-vs-save-first",
        description:
          "Protect future-focused goals by avoiding unnecessary short-term costs.",
      },
    ],
  },
  defaultProgress: {
    protectionSetup: "not-started",
    educationFund: "not-started",
    growthAssets: "not-started",
    legacyStructures: "not-started",
  },
  messages: {
    applied:
      "You've applied Legacy & Impact Path as your active strategy track.",
    alreadyActive:
      "You already have an active strategy track. Untrack it first before applying a new one.",
    untracked: "Legacy & Impact Path has been untracked.",
    defaultTip:
      "Complete your financial setup to unlock more personalised legacy-building tips.",
  },
};

export default legacyImpactPathData;