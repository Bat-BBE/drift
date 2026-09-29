"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Locale = "mn" | "en";

const STORAGE_KEY = "drift-locale";

const dict = {
  mn: {
    onlineConnecting: "Онлайн хэрэглэгчдийн мэдээллийг авч байна...",
    loading: "Ачааллаж байна...",

    onlineCount: (n: number) => `Яг одоо ${n} хүн ярилцахад бэлэн байна`,

    heroLine1: "Шинэ хүнтэй",
    heroLine2: "яриа эхлүүлье",

    heroSubtitle:
      "Нэрээ нууцлан, ямар ч дарамтгүйгээр шинэ хүмүүстэй ярилц. Заримдаа ганцхан яриа таны өдрийг өөрчилж чадна.",

    startChatting: "Чат эхлүүлэх",

    ageConfirm: "Би 18 ба түүнээс дээш настай.",

    continue: "Үргэлжлүүлэх",

    shareLabel: "Найз руугаа хуваалцах",
    shareCopied: "Холбоос хуулагдлаа!",

    beforeContinue: "Үргэлжлүүлэхийн өмнө",

    gateHint: "Хамгаалалт бидний хувьд чухал — доорхыг уншаад зөвшөөрнө үү",

    safetyTitle: "Аюулгүй ярилцах зөвлөмж",

    safetyTips: [
      "Хувийн мэдээллээ (нэр, утас, хаяг гэх мэт) бусдад бүү дамжуулаарай.",
      "Хэрэв яриа танд тухгүй санагдвал хүссэн үедээ шууд гарах боломжтой.",
      "Зохисгүй хэрэглэгчтэй таарвал мэдээлэх товчийг ашиглаарай.",
      "Хүндлэлтэй, эелдэг харилцаа хамгийн сайхан яриаг бий болгодог.",
    ],

    seen: "харсан",

    icebreaker: "Санамсаргүй асуулт",

    zodiacButton: "Ордоороо тааръя",

    zodiacTitle: "Таны орд юу вэ?",

    zodiacPicked: "Сонгосон орд:",
    friendRequestButton: "Найз болох",
    friendRequestPill: "найз болохыг хvслээ",
    friendAddedBanner: "🎉 Та хоёул найз боллоо!",
    friendsTitle: "Найзууд",
    friendsEmpty:
      "Одоохондоо найз алга. Ярилцлагадаа хоёулаа 🤝 дарвал энд гарч ирнэ.",
    friendSince: "Найз болсон",
    removeFriendButton: "Хасах",
    removeFriendConfirm: "Итгэлтэй байна уу?",

    notDating:
      "Энэ бол болзооны апп биш. Харин хүмүүсийг чөлөөтэй ярилцуулж, аюулгүй цахим орчинд шинэ харилцаа холбоо үүсгэх платформ юм.",

    matchesToday: (n: number) => `Өнөөдөр ${n} хүн хоорондоо холбогдсон`,

    howItWorksTitle: "Хэрхэн ажилладаг вэ?",

    step1Title: "Эхлүүлэх",

    step1Desc: "Нэг товч дарахад л хангалттай. Бүртгэлгүйгээр шууд эхэлнэ.",

    step2Title: "Холбогдох",

    step2Desc: "Систем танд ярилцах шинэ хүнийг автоматаар олно.",

    step3Title: "Ярилцах",

    step3Desc:
      "Чөлөөтэй ярилц. Та хоёрын яриа нууцлалтай бусдаас тусгаарлагдах болно.",

    interestTitle: "Сонгох",
    interestSubtitle: "Сонголтоос хамаарч тохирох хүнтэй холбох болно",
    interestStartAny: "Хайж эхлэх",
    interestStartWithCount: (n: number) => `${n} сонголттой хайх`,

    searching1: "Танд тохирох хүнийг хайж байна...",

    searching2: "Түр хүлээнэ үү...",

    genderSectionLabel: "Ямар төрлийн хүнтэй холбогдох вэ?",
    interestSectionLabel: "Ямар сэдвээр ярилцах вэ?",

    searching3: "Шинэ яриа эхлэх гэж байна...",

    searching4: "Холбож байна...",

    cancelSearch: "Хайлт зогсоох",

    noMatchTitle: "Одоогоор холбогдох хүн алга",

    noMatchSubtitle:
      "Яг одоогоор онлайн хэрэглэгч байхгүй байна. Түр хүлээгээд дахин оролдоно уу.",

    tryAgain: "Дахин оролдох",

    matchFound: "Шинэ хүнтэй холбогдлоо!",

    connecting: "Яриаг эхлүүлж байна...",

    stranger: "Шинэ хүн",

    typeMessage: "Мессежээ бичээрэй...",

    duelButton: "Х~Ч~Д",

    duelInviteText: "Нөгөө Х-Ч-Д тоглохыг санал болголоо",
    quizInviteText: "Нөгөө хүн Soulmate vs Friendly асуулгыг бөглөсөн байна",
    inviteAccept: "Зөвшөөрөх",
    inviteDecline: "Татгалзах",

    quizButton: "S vs F",

    close: "Хаах",

    duelMoveRock: "Чулуу",
    duelMovePaper: "Цаас",
    duelMoveScissors: "Хайч",
    duelGameTitle: "⚔️ Чулуу ~ Цаас ~ Хайч",
    duelPickPrompt: "Сонголтоо хий",
    duelWaitingText: "Сонголтоо хийлээ ✅ Нөгөө хүнийг хүлээж байна...",
    duelWaitingHint: "Та хүлээхгүйгээр гарч, дараа нь буцаж орж болно.",
    duelBothPickedText: "Хоёулаа сонгосон... 🥁",
    duelResultWin: "🎉 Та яллаа!",
    duelResultLose: "😅 Та хожигдлоо",
    duelResultDraw: "🤝 Тэнцлээ",
    duelRematch: "Дахин тоглох",
    duelExit: "Гарах",

    quizModalTitle: "💫 Soulmate vs Friendly",
    quizAnsweredText: "Хариулт бүртгэгдлээ",
    quizWaitingPartner: "Нөгөө хүнийг хүлээж байна...",
    quizLeaningSoulmate: "Soulmate тал руу хазайлаа",
    quizLeaningFriendly: "Friendly тал руу хазайлаа",
    quizResultSoulmateLabel: "💘 Soulmate",
    quizResultFriendlyLabel: "👯 Friendly",

    streakMilestoneLabel: "streak!",
    streakMilestoneLow: "Сайхан яриа өрнөж байна!",
    streakMilestoneMid: "Энэ бол жинхэнэ дэс дараалал! 🔥",
    streakMilestoneHigh: "Легендар яриа боллоо! 🏆",

    replyThemLabel: "Тэр",
    flaggedTooltip: "Энэ мессеж линк эсвэл сэжигтэй агуулга агуулж болзошгүй",

    messageReply: "Хариулах",
    messageCopy: "Хуулах",
    messageCopied: "Хуулагдлаа ✓",
    messageDelete: "Устгах",
    moreEmojiLabel: "Бусад emoji",
    emojiPickerTitle: "Emoji сонгох",

    zodiacLoveLabel: "Хайр",
    zodiacChatStyleLabel: "Ярилцах хэв маяг",
    zodiacHobbyLabel: "Хоббио",
    zodiacMusicLabel: "Дуртай хөгжим",
    zodiacHumorLabel: "Хошин мэдрэмж",
    zodiacActiveTimeLabel: "Идэвхтэй цаг",
    zodiacRedFlagLabel: "Red flag",
    zodiacGreenFlagLabel: "Green flag",
    zodiacNightOwl: "Шөнийн хүн",
    zodiacMorningPerson: "Өглөөний хүн",
    zodiacAverage: "Дунд зэрэг",
    zodiacDatingScore: "Dating score",
    zodiacFriendshipScore: "Friendship score",
    zodiacRelationshipScore: "Relationship score",
    zodiacYouLabel: "Чи",
    zodiacThemLabel: "Тэр хүн",
    zodiacShowMore: "Дэлгэрэнгүй харах",
    zodiacShowLess: "Хураах",

    quickReactionsLabel: "Хурдан хариу",

    profileSetupTitle: "Өөрийгөө танилцуулаарай",
    profileSetupSubtitle:
      "Нэр, зурган дүрээ сонгоно уу. Энэ нь зөвхөн таны төхөөрөмж дээр хадгалагдана, найзууд тань үүнийг харах болно.",
    nicknamePlaceholder: "Нэрээ бичих...",
    nicknameRandomButton: "🎲 Санамсаргүй нэр",
    chooseAvatarLabel: "Зурган дүрээ сонго",
    profileContinueButton: "Үргэлжлүүлэх",
    editNicknameTitle: "Нэр, зурган дүр",
    editNicknameDesc: "Нэр болон зурган дүрээ хүссэн үедээ солиж болно.",
    saveButton: "Хадгалах",
    savedToast: "Хадгалагдлаа",

    chatInboxTitle: "Чат",
    startRandomChatCta: "Random chat эхлүүлэх",
    chatInboxEmpty:
      "Одоохондоо найз алга. Санамсаргүй хүнтэй ярилцаад, 🤝 дарж найз болвол энд гарч ирнэ.",
    sayHiPreview: "Мэндлээрэй 👋",
    youPrefix: "Та:",
    messagePlaceholder: "Мессеж бичих...",

    you: "Та",

    send: "Илгээх",

    leave: "Яриаг дуусгах",

    reportTitle: "Хэрэглэгчийг мэдээлэх",

    reportSubtitle:
      "Мэдээлсний дараа энэ яриа шууд дуусна. Таны мэдээлэл нууц хэвээр үлдэнэ.",

    reportReasons: [
      "Дарамталсан",
      "Спам эсвэл бот",
      "Зохисгүй бэлгийн агуулга",
      "Насанд хүрээгүй байж болзошгүй",
      "Үзэн ядалт, доромжлол",
      "Бусад",
    ],

    cancel: "Болих",

    disconnectedTitle: "Нөгөө тал яриаг дуусгалаа",

    disconnectedSubtitle: "Та хүсвэл өөр хүнтэй дахин ярилцаж болно.",

    reportedTitle: "Мэдээлэл амжилттай илгээгдлээ",

    reportedSubtitle:
      "Баярлалаа. Таны мэдээллийг хүлээн авлаа. Энэ мэдээлэл нөгөө хэрэглэгчид харагдахгүй.",

    findNewMatch: "Шинэ хүнтэй холбогдох",

    rateTitle: "Энэ яриа танд ямар санагдав?",

    rateSubtitle:
      "Таны үнэлгээ дараагийн удаа илүү тохирох хүнтэй холбох боломжийг сайжруулахад тусална.",

    good: "Таалагдсан",

    notGreat: "Тийм ч биш",

    searchBlockedError:
      "Аюулгүй байдлын шалтгаанаар түр хугацаанд хайлт хийх боломжгүй байна",
    rateLimitedError: "Түр хүлээгээд дахин оролдоно уу",
    messageBlockedError: "Энэ мессежийг илгээх боломжгүй байна",

    nextMatch: "Өөр хүнтэй ярилцах",

    backHome: "← Нүүр хуудас",

    navHome: "Нүүр",
    navChat: "Чат",
    navFriends: "Найзууд",
    navSettings: "Тохиргоо",

    featureFastTitle: "Хурдан тохирол",
    featureFastDesc: "Хэдхэн секундэд холбогдоно",
    featureSafeTitle: "Аюулгүй, нууцлалтай",
    featureSafeDesc: "Хувийн мэдээлэл шаардахгүй",
    featureGlobalTitle: "Дэлхий даяар",
    featureGlobalDesc: "Хаана ч байгаа хүмүүстэй ярилц",
    featureFunTitle: "Хялбар, хөгжилтэй",
    featureFunDesc: "Нээгээд шууд ярилцаарай",

    guestLabel: "Зочин",
    availableStatus: "Идэвхтэй",

    onlineUsersTitle: "Онлайн хэрэглэгчид",
    quickTipsTitle: "Зөвлөмжүүд",
    recentChatsTitle: "Сүүлийн ярилцлагууд",
    recentChatsEmpty:
      "Одоохондоо ярилцлага алга. Мессежийн агуулгыг бид хадгалдаггүй тул зөвхөн ярилцсан хүн, цаг энд харагдана.",
    recentChatEndedLabel: "Ярилцлага дууссан",

    friendsSubtitle:
      "Ярилцаж байхдаа 🤝 дарж хоёулаа зөвшөөрвөл энд гарч ирнэ. Бид нэр, мессежийг хадгалдаггүй тул зөвхөн зочны дүр харагдана.",
    friendRequestSent: "Хүсэлт илгээсэн, хариу хүлээж байна...",
    friendChip: "🤝 Найз болох",

    settingsTitle: "Тохиргоо",
    settingsAppearanceTitle: "Харагдац",
    settingsAppearanceDesc: "Гэрэл/харанхуй горим болон хэлийг сонгоно уу.",
    settingsThemeLabel: "Дэлгэцийн горим",
    settingsThemeDark: "Харанхуй",
    settingsThemeLight: "Гэрэл",
    settingsLanguageLabel: "Хэл",
    settingsPrivacyTitle: "Нууцлал ба өгөгдөл",
    settingsPrivacyDesc:
      "Random chat-ын мессежийг сервер дээр хэзээ ч хадгалдаггүй — room хаагдмагц бүрмөсөн устана. Найзуудтайгаа бичсэн чат (Chat таб) 3 хоногийн турш хадгалагдаад, дараа нь автоматаар устдаг.",
    settingsBlockedTitle: "Блоклосон хэрэглэгчид",
    settingsBlockedEmpty: "Та хэн ч блоклоогүй байна.",
    settingsUnblock: "Блок цуцлах",
    settingsClearRecentTitle: "Сүүлийн ярилцлагын түүх",
    settingsClearRecentDesc:
      "Энэ төхөөрөмж дээрх ярилцсан хүмүүсийн жагсаалтыг устгана. Мессежийн агуулга хадгалагддаггүй тул устгах зүйл байхгүй.",
    settingsClearRecentButton: "Түүх устгах",
    settingsClearedToast: "Устгагдлаа",
  },

  en: {
    onlineConnecting: "Checking who's online...",
    loading: "Loading...",

    onlineCount: (n: number) => `${n} people are ready to chat`,

    heroLine1: "Start a",
    heroLine2: "real conversation",

    heroSubtitle:
      "Meet new people in a safe, anonymous space. No sign-up, no pressure—just genuine conversations.",

    startChatting: "Start chatting",

    ageConfirm: "I am 18 years old or older.",

    continue: "Continue",

    shareLabel: "Share with a friend",
    shareCopied: "Link copied!",

    interestTitle: "What are you into?",
    interestSubtitle:
      "Pick a few interests to get matched with someone who shares them",
    interestStartAny: "Start chatting",
    interestStartWithCount: (n: number) =>
      `Search with ${n} interest${n > 1 ? "s" : ""}`,

    you: "You",

    beforeContinue: "Before you continue",

    gateHint:
      "Your safety matters to us. Please read and agree to the guidelines below.",

    safetyTitle: "Stay safe while chatting",

    genderSectionLabel: "Who would you like to chat with?",
    interestSectionLabel: "Choose a conversation topic",

    safetyTips: [
      "Never share personal information such as your name, phone number, or address.",
      "If a conversation makes you uncomfortable, you can leave at any time.",
      "Report anyone who behaves inappropriately or seems suspicious.",
      "Kindness and respect help create better conversations for everyone.",
    ],

    seen: "seen",

    icebreaker: "Random question",

    zodiacButton: "Match by zodiac",

    zodiacTitle: "What's your zodiac sign?",

    zodiacPicked: "Selected zodiac:",

    friendRequestButton: "Become friends",

    friendRequestPill: "wants to be friends",

    friendAddedBanner: "🎉 You're friends now!",

    friendsTitle: "Friends",

    friendsEmpty:
      "You don't have any friends yet. If both of you tap 🤝 during a conversation, they'll appear here.",

    friendSince: "Friends since",
    removeFriendButton: "Remove",
    removeFriendConfirm: "Are you sure?",

    notDating:
      "This isn't a dating app. It's a safe place where people can meet, have real conversations, and build genuine connections.",

    matchesToday: (n: number) => `${n} people connected today`,

    howItWorksTitle: "How it works",

    step1Title: "Start",

    step1Desc: "Just tap the button. No sign-up or account required.",

    step2Title: "Connect",

    step2Desc:
      "We'll automatically match you with someone who's ready to chat.",

    step3Title: "Talk",

    step3Desc:
      "Enjoy the conversation. Your chat is private and only visible to the two of you.",

    searching1: "Looking for someone to chat with...",

    searching2: "Please wait a moment...",

    searching3: "Getting your conversation ready...",

    searching4: "Connecting you now...",

    cancelSearch: "Cancel search",

    noMatchTitle: "No one is available right now",

    noMatchSubtitle:
      "There aren't any users online at the moment. Please wait a little and try again.",

    tryAgain: "Try again",

    matchFound: "You've been matched!",

    connecting: "Starting your conversation...",

    stranger: "New person",

    searchBlockedError: "Search is temporarily unavailable for safety reasons.",

    rateLimitedError:
      "You're doing that too quickly. Please try again shortly.",

    messageBlockedError: "Unable to send this message.",

    typeMessage: "Type your message...",

    send: "Send",
    duelButton: "Х~Ч~Д",

    duelInviteText: "The other person wants to play Rock-Paper-Scissors",
    quizInviteText: "The other person finished the Soulmate vs Friendly quiz",
    inviteAccept: "Join",
    inviteDecline: "Not now",

    quizButton: "S vs F",

    close: "Close",

    duelMoveRock: "Rock",
    duelMovePaper: "Paper",
    duelMoveScissors: "Scissors",
    duelGameTitle: "⚔️ Rock ~ Paper ~ Scissors",
    duelPickPrompt: "Make your pick",
    duelWaitingText: "You picked ✅ Waiting for the other person...",
    duelWaitingHint: "You can leave without waiting and come back later.",
    duelBothPickedText: "Both picked... 🥁",
    duelResultWin: "🎉 You won!",
    duelResultLose: "😅 You lost",
    duelResultDraw: "🤝 It's a draw",
    duelRematch: "Play again",
    duelExit: "Leave",

    quizModalTitle: "💫 Soulmate vs Friendly",
    quizAnsweredText: "Your answer is in",
    quizWaitingPartner: "Waiting for the other person...",
    quizLeaningSoulmate: "Leaning Soulmate",
    quizLeaningFriendly: "Leaning Friendly",
    quizResultSoulmateLabel: "💘 Soulmate",
    quizResultFriendlyLabel: "👯 Friendly",

    streakMilestoneLabel: "streak!",
    streakMilestoneLow: "This is turning into a great conversation!",
    streakMilestoneMid: "Now that's a real rhythm! 🔥",
    streakMilestoneHigh: "Legendary conversation! 🏆",

    replyThemLabel: "Them",
    flaggedTooltip: "This message may contain a link or suspicious content",

    messageReply: "Reply",
    messageCopy: "Copy",
    messageCopied: "Copied ✓",
    messageDelete: "Delete",
    moreEmojiLabel: "More emoji",
    emojiPickerTitle: "Pick an emoji",

    zodiacLoveLabel: "Love",
    zodiacChatStyleLabel: "Chat style",
    zodiacHobbyLabel: "Hobby",
    zodiacMusicLabel: "Music taste",
    zodiacHumorLabel: "Sense of humor",
    zodiacActiveTimeLabel: "Active hours",
    zodiacRedFlagLabel: "Red flag",
    zodiacGreenFlagLabel: "Green flag",
    zodiacNightOwl: "Night owl",
    zodiacMorningPerson: "Morning person",
    zodiacAverage: "In between",
    zodiacDatingScore: "Dating score",
    zodiacFriendshipScore: "Friendship score",
    zodiacRelationshipScore: "Relationship score",
    zodiacYouLabel: "You",
    zodiacThemLabel: "Them",
    zodiacShowMore: "Show more",
    zodiacShowLess: "Show less",

    quickReactionsLabel: "Quick reactions",

    profileSetupTitle: "Introduce yourself",
    profileSetupSubtitle:
      "Pick a nickname and an avatar. This only lives on your device, and it's what your friends will see.",
    nicknamePlaceholder: "Type a nickname...",
    nicknameRandomButton: "🎲 Random name",
    chooseAvatarLabel: "Choose your avatar",
    profileContinueButton: "Continue",
    editNicknameTitle: "Nickname & avatar",
    editNicknameDesc: "Change your nickname and avatar anytime.",
    saveButton: "Save",
    savedToast: "Saved",

    chatInboxTitle: "Chat",
    startRandomChatCta: "Start random chat",
    chatInboxEmpty:
      "No conversations yet. Chat with someone random, tap 🤝 to become friends, and they'll show up here.",
    sayHiPreview: "Say hi 👋",
    youPrefix: "You:",
    messagePlaceholder: "Type a message...",

    leave: "End conversation",

    reportTitle: "Report this user",

    reportSubtitle:
      "Reporting this user will immediately end the conversation. Your report will remain completely anonymous.",

    reportReasons: [
      "Harassment",
      "Spam or bot",
      "Sexual content",
      "Possible minor",
      "Hate speech or abusive language",
      "Other",
    ],

    cancel: "Cancel",

    disconnectedTitle: "The other person left the conversation",

    disconnectedSubtitle:
      "You can always start a new conversation with someone else.",

    reportedTitle: "Report submitted",

    reportedSubtitle:
      "Thank you. We've received your report. The other person will not know that you reported them.",

    findNewMatch: "Find someone new",

    rateTitle: "How was this conversation?",

    rateSubtitle: "Your feedback helps us make future matches even better.",

    good: "Enjoyed it",

    notGreat: "Not really",

    nextMatch: "Start another conversation",

    backHome: "← Back to home",

    navHome: "Home",
    navChat: "Chat",
    navFriends: "Friends",
    navSettings: "Settings",

    featureFastTitle: "Fast Match",
    featureFastDesc: "Get connected in seconds",
    featureSafeTitle: "Safe & Private",
    featureSafeDesc: "No personal data required",
    featureGlobalTitle: "Global",
    featureGlobalDesc: "Chat with people worldwide",
    featureFunTitle: "Fun & Simple",
    featureFunDesc: "Just open and chat",

    guestLabel: "Guest",
    availableStatus: "Available",

    onlineUsersTitle: "Online Users",
    quickTipsTitle: "Quick Tips",
    recentChatsTitle: "Recent Chats",
    recentChatsEmpty:
      "No conversations yet. We never store what was said, so only who you talked to and when will show up here.",
    recentChatEndedLabel: "Conversation ended",

    friendsSubtitle:
      "Tap 🤝 during a chat — if you both do, they'll show up here. We don't store names or messages, so you'll only see a guest avatar.",
    friendRequestSent: "Request sent, waiting for a reply...",
    friendChip: "🤝 Become friends",

    settingsTitle: "Settings",
    settingsAppearanceTitle: "Appearance",
    settingsAppearanceDesc: "Choose your theme and language.",
    settingsThemeLabel: "Theme",
    settingsThemeDark: "Dark",
    settingsThemeLight: "Light",
    settingsLanguageLabel: "Language",
    settingsPrivacyTitle: "Privacy & data",
    settingsPrivacyDesc:
      "Random chat messages are never stored on our servers — the moment a room closes, they're gone for good. Conversations with friends (the Chat tab) are kept for 3 days, then deleted automatically.",
    settingsBlockedTitle: "Blocked users",
    settingsBlockedEmpty: "You haven't blocked anyone.",
    settingsUnblock: "Unblock",
    settingsClearRecentTitle: "Recent chats history",
    settingsClearRecentDesc:
      "Clears the local list of people you've talked to on this device. Message content is never stored, so there's nothing else to delete.",
    settingsClearRecentButton: "Clear history",
    settingsClearedToast: "Cleared",
  },
} as const;

// Module-level store so every component that calls useLocale() reads and
// writes the same value — a plain useState per call site would let two
// mounted instances (e.g. the sidebar's toggle and a page's own content)
// drift out of sync, since setting one never re-renders the other.
let currentLocale: Locale = "mn";
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved === "mn" || saved === "en") currentLocale = saved;
}

function setGlobalLocale(next: Locale) {
  hydrate();
  currentLocale = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  hydrate();
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return "mn";
}

export function useLocale() {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    setGlobalLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setGlobalLocale(currentLocale === "mn" ? "en" : "mn");
  }, []);

  return { locale, setLocale, toggleLocale, t: dict[locale] };
}
