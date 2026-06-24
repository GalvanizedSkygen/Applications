export const POSITIONS = [
  "Staff",
  "Event Hoster",
  "Builder",
  "Developer",
  "Media Team",
  "Discord Staff",
];

export const getQuestionsForPosition = (position) => {
  const common = [
    {
      id: "activity",
      label: "How active are you?",
      type: "text",
      placeholder: "E.g. 2-3 hours a day",
    },
  ];

  switch (position) {
    case "Staff":
      return [
        ...common,
        {
          id: "experience",
          label:
            "Are you or have you been a staff in other realms/servers? And what position were you?",
          type: "textarea",
        },
        {
          id: "contribution",
          label: "What can you bring to the realm? Be descriptive.",
          type: "textarea",
        },
        {
          id: "scenario",
          label: "How would you handle a player breaking a serious rule?",
          type: "textarea",
        },
      ];
    case "Event Hoster":
      return [
        ...common,
        {
          id: "experience",
          label: "Have you hosted events before? What kind?",
          type: "textarea",
        },
        {
          id: "ideas",
          label: "What kind of events would you run on our realm?",
          type: "textarea",
        },
      ];
    case "Builder":
      return [
        ...common,
        {
          id: "experience",
          label: "Are you or have you been a builder in other realms?",
          type: "textarea",
        },
        {
          id: "styles",
          label: "What styles of building are you best at?",
          type: "text",
        },
        {
          id: "portfolio",
          label:
            "Provide links to screenshots or videos of your builds (Imgur/YouTube links)",
          type: "textarea",
        },
      ];
    case "Developer":
      return [
        ...common,
        {
          id: "skills",
          label: "What skills do you have? (Commands, Addons, APIs, etc.)",
          type: "textarea",
        },
        {
          id: "portfolio",
          label:
            "Provide links to your previous work, addons, or GitHub repos.",
          type: "textarea",
        },
      ];
    case "Media Team":
      return [
        ...common,
        {
          id: "socials",
          label:
            "Provide links for any socials you plan to post your content on (YouTube, TikTok, etc.)",
          type: "textarea",
        },
        {
          id: "frequency",
          label: "How often can you post content?",
          type: "text",
        },
      ];
    case "Discord Staff":
      return [
        ...common,
        {
          id: "experience",
          label: "Do you have experience moderating Discord servers?",
          type: "textarea",
        },
        {
          id: "bots",
          label: "What Discord bots are you familiar with configuring/using?",
          type: "textarea",
        },
      ];
    default:
      return common;
  }
};
