import track1 from "../assets/images/roger-starnes-sr-YTqHwZhykMg-unsplash.jpg";

const firstPropertyPathData = {
  trackId: "first-property-path",
  progressStorageKey: "first-property-progress",
  hero: {
    title: "First Property Path",
    subheading: "Build toward owning your own home in 3-5 years",
    src: track1,
    alt: "Modern apartment building",
  },
  intro: {
    tag: "First Property Path",
    description:
      "This path is for people who want home ownership to become the foundation of their long-term financial future. It focuses on disciplined saving, improving affordability, and preparing for the real costs of buying a home.",
  },
  priorities: {
    title: "Key Priorities",
    items: [
      "Saving aggressively for a deposit",
      "Building and protecting your credit score",
      "Understanding the true costs of buying property",
      "Reducing spending that delays your property goal",
    ],
  },
  milestonesSectionTitle: "5-year roadmap",
  milestones: [
    {
      number: 1,
      progressKey: "emergencyFund",
      year: "Year 1",
      title: "Build your financial base",
      description:
        "Save an emergency fund, check your credit score, and fix any repayment issues early.",
    },
    {
      number: 2,
      progressKey: "creditScore",
      year: "Year 1",
      title: "Improve your credit profile",
      description:
        "Check your record, pay consistently, and avoid new debt that could weaken future bond approval.",
    },
    {
      number: 3,
      progressKey: "depositFund",
      year: "Years 2-3",
      title: "Grow your deposit fund",
      description:
        "Build a dedicated deposit fund and stay consistent with monthly contributions.",
    },
    {
      number: 4,
      progressKey: "homeLoanPrep",
      year: "Years 4-5",
      title: "Prepare to buy",
      description:
        "Aim for a 10%+ deposit, understand the full buying costs, and enter the market with more confidence.",
    },
  ],
  accordion: {
    title: "Did you know?",
    items: [
      {
        title: "Emergency fund before deposit",
        content:
          "Before committing to a bond, you need a safety buffer. Without one, a surprise cost can derail both your deposit savings and your future affordability.",
      },
      {
        title: "Deposit is not the full cost",
        content:
          "Saving for a deposit is only one part of buying a home. You also need to prepare for registration costs, legal fees, and ongoing ownership expenses.",
      },
      {
        title: "Other costs to consider",
        content:
          "Beyond the monthly repayment, you may need to budget for a monthly service fee, home owners comprehensive insurance, life assurance, rates and taxes, levies, and monthly water and electricity costs.",
      },
      {
        title: "A realistic budgeting tip",
        content:
          "A useful rule of thumb is to have about 8% of the property value available for registration costs and other buying expenses. This is separate from your deposit.",
      },
      {
        title: "Why credit score matters",
        content:
          "Your credit behaviour affects approval and affordability. Strong repayment habits now can improve your chances when you apply for a bond later.",
      },
    ],
  },
  sidebar: {
    tradeOffsTitle: "Trade-offs to understand",
    tradeOffs: [
      "Property ties up money in a non-liquid asset.",
      "Other goals like offshore investing may move more slowly.",
      "Large purchases now can delay your deposit by months or years.",
    ],
    studios: [
      {
        title: "Home Loan Calculator",
        path: "/simulation-lab/home-loan-calculator",
        description: "Estimate what property range fits your income.",
      },
      {
        title: "Vehicle Finance Calculator",
        path: "/simulation-lab/vehicle-finance-calculator",
        description: "Check if car debt is hurting your property timeline.",
      },
    ],
  },
  defaultProgress: {
    emergencyFund: "not-started",
    creditScore: "not-started",
    depositFund: "not-started",
    homeLoanPrep: "not-started",
  },
  messages: {
    applied: "You've applied First Property Path as your active strategy track.",
    alreadyActive:
      "You already have an active strategy track. Untrack it first before applying a new one.",
    untracked: "First Property Path has been untracked.",
    defaultTip:
      "Complete your financial setup to unlock more personalised property tips.",
  },
};

export default firstPropertyPathData;