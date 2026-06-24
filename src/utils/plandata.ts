// plandata.ts

export interface MembershipPlanDuration {
  name: string; // "Monthly", "3 Months", "6 Months", "Yearly"
  months: number;
  benefits: string;
  priceMultiplier: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string; // Base monthly price
  period: string; // e.g. "month"
  description: string;
  longDescription: string;
  features: string[];
  popular?: boolean;
  benefits: string[];
  recommendedFor: string[];
  durations: MembershipPlanDuration[];
  includedServices: {
    name: string;
    description: string;
    sessions: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const addOnsList: AddOn[] = [
  { id: "extra-tarot", name: "Extra Tarot Session", price: 2100, description: "Additional deep-dive tarot guidance session" },
  { id: "extra-healing", name: "Extra Healing Session", price: 5100, description: "Additional remote reiki & sound healing session" },
  { id: "urgent-reading", name: "Urgent Reading (within 30 minutes)", price: 21000, description: "Priority emergency reading delivered in 30 mins" },
  { id: "manifestation-coaching", name: "Manifestation Coaching (weekly)", price: 11000, description: "Weekly 1-on-1 coaching for manifestation guidance" },
];

export const membershipPlans: MembershipPlan[] = [
  {
    id: "basic-aura",
    name: "Basic Aura Subscription",
    price: "₹2,100",
    period: "month",
    description: "For beginners who want light support & monthly guidance.",
    longDescription:
      "The Basic Aura Subscription is designed for beginners who want a gentle introduction to spiritual guidance, energy work, and personal growth under the direction of Osheen Ma'am.",
    features: [
      "1 Tarot Guidance Session/month (voice note)",
      "1 chakra scanning",
      "Access to voice note healing session with Osheen maam",
      "1 prediction (1 question)",
      "1 Affirmation Sheet",
      "Priority WhatsApp replies within 3 days",
    ],
    benefits: [
      "Light support & monthly guidance",
      "Clear chakra diagnosis",
      "Access to direct voice note healings",
      "Monthly affirmation training",
    ],
    recommendedFor: [
      "Spiritual beginners",
      "Anyone wanting light guidance",
      "Budget-friendly seekers",
    ],
    durations: [
      { name: "Monthly", months: 1, benefits: "Basic features only.", priceMultiplier: 1 },
      { name: "3 Months", months: 3, benefits: "+1 one to one call with osheen maam per month (15-20min)", priceMultiplier: 3 },
      { name: "6 Months", months: 6, benefits: "+1 Bonus Healing Session(voicenote) + 2 Custom Affirmation session + 1 call with osheen maam/month", priceMultiplier: 6 },
      { name: "Yearly", months: 12, benefits: "+ 3 Bonus Tarot sessions (30 mins each) + 1 Full Chakra Healing + 1 Personalised 12-Month Prediction PDF + 1 call with osheen maam/month", priceMultiplier: 12 },
    ],
    includedServices: [
      {
        name: "Tarot Session",
        description: "Voice-note based tarot reading answering your key life questions.",
        sessions: "1 per month",
      },
      {
        name: "Chakra Scanning",
        description: "Scanning of major chakra points to find blockages and energy levels.",
        sessions: "1 per month",
      },
    ],
    faqs: [
      {
        question: "How long are the voice note sessions?",
        answer: "Tarot guidance voice notes are detailed and address your questions comprehensively, typically lasting 10-15 minutes.",
      },
    ],
  },
  {
    id: "tarot-insight",
    name: "Tarot Insight Subscription",
    price: "₹4,200",
    period: "month",
    description: "Focused tarot support for people who need regular answers.",
    longDescription:
      "The Tarot Insight Subscription is tailored for individuals seeking regular tarot support, detailed decision analysis, and direct consultations to resolve doubts fast.",
    features: [
      "2 Full Tarot Readings/month (30 mins each)",
      "2 Quick Doubt Tarot Checks/month",
      "1 Decision Guidance Session/month (voice note)",
      "Access to 'Members Only' monthly prediction",
      "Priority WhatsApp support (reply within 48 hours)",
    ],
    benefits: [
      "Regular deep tarot answers",
      "Doubt clearance on the go",
      "Members-only prediction reports",
      "Fast priority replies on WhatsApp",
    ],
    recommendedFor: [
      "People navigating complex life situations",
      "Seekers needing weekly/bi-weekly tarot advice",
    ],
    durations: [
      { name: "Monthly", months: 1, benefits: "All basic tarot features", priceMultiplier: 1 },
      { name: "3 Months", months: 3, benefits: "+1 additional tarot reading + 1 healing session (on call) with osheen", priceMultiplier: 3 },
      { name: "6 Months", months: 6, benefits: "+2 additional tarot readings + 2 healing sessions (on call) osheen + affirmation session on call", priceMultiplier: 6 },
      { name: "Yearly", months: 12, benefits: "+ monthly readings (voicenote) + 6 detailed love/finance readings + 1 Ritual/per month + per month affirmation session + 1 video tarot session with osheen Maam", priceMultiplier: 12 },
    ],
    includedServices: [
      {
        name: "Full Tarot Readings",
        description: "Deep dive 30-minute readings covering love, career, or life path.",
        sessions: "2 per month",
      },
    ],
    faqs: [
      {
        question: "What is a Quick Doubt Tarot Check?",
        answer: "It allows you to get text or voice responses to short, urgent questions within a few hours.",
      },
    ],
  },
  {
    id: "healing-energy",
    name: "Healing & Energy Subscription",
    price: "₹6,300",
    period: "month",
    description: "For people needing deep emotional/energy transformation.",
    longDescription:
      "The Healing & Energy Subscription provides continuous therapeutic alignment, guided meditation, and custom energetic rituals to dissolve blockages and restore emotional peace.",
    features: [
      "2 Energy Healings/month (Reiki/Chakra/Angel healing)",
      "2 Aura Scan Reports/month",
      "1 ritual/month",
      "1 Guided Meditation/month",
      "Monthly Readings (voice note)",
      "WhatsApp priority: replies within 24 hrs",
      "Astrological kundali analysis",
    ],
    benefits: [
      "Deep emotional release & alignment",
      "Aura analysis report tracking",
      "Karma & Angel healing integrations",
      "Direct guidance calls with Osheen Ma'am",
    ],
    recommendedFor: [
      "Seekers undergoing stress or trauma",
      "Anyone desiring deep vibrational healing",
    ],
    durations: [
      { name: "Monthly", months: 1, benefits: "All main healing features", priceMultiplier: 1 },
      { name: "3 Months", months: 3, benefits: "+1 Angel Healing session (voice note) + 1 transformation session", priceMultiplier: 3 },
      { name: "6 Months", months: 6, benefits: "+2 Angel Healings + 1 karma healing + 1 Positive affirmation session with osheen Maam on call + 2 transformation session per month + kundali analysis", priceMultiplier: 6 },
      { name: "Yearly", months: 12, benefits: "+ 6 Bonus Healings (on call) + 1 Full Chakra Alignment (7-session series)(video recorded) + 1 Personalized ritual Manual + 3 Cord-Cutting sessions across the year(or aura cleansing, according to need) + 2 video call healing sessions + 1 gift + Kundali analysis and totkas", priceMultiplier: 12 },
    ],
    includedServices: [
      {
        name: "Energy Healings",
        description: "Reiki, Angel, or Chakra healing sessions customized to your current vibration.",
        sessions: "2 per month",
      },
    ],
    faqs: [
      {
        question: "Do I need to be active during energy healing?",
        answer: "Healing sessions are remote; Osheen Ma'am coordinates the timing so you can be in a receptive, relaxed state.",
      },
    ],
  },
  {
    id: "premium-manifestation",
    name: "Premium Manifestation & Ritual Subscription",
    price: "₹10,500",
    period: "month",
    description: "For clients who want spellwork, manifestation support & full guidance.",
    longDescription:
      "Our most elite tier. Get personalized roadmaps, astrological compatibility checks, major monthly rituals, VIP hotlines, and complete spiritual mentorship directly from Osheen Ma'am.",
    features: [
      "1 Major Ritual Every Month (Money / Protection / Love / Success)",
      "2 Tarot Readings/month",
      "Unlimited tarot doubts (text-based)",
      "2 Healings/month",
      "Full Aura Scan & Report every month",
      "Personal Manifestation Roadmap",
      "WhatsApp VIP lane replies within 12 hours",
      "Call support: 1 priority call/month",
      "Monthly personalised affirmations & scripting guidance",
      "Full Astrology kundali analysis",
      "Monthly Astrological Rituals and totkas",
    ],
    benefits: [
      "Custom high-level spellwork and major rituals",
      "Unlimited questions answered fast",
      "VIP direct hotline and compatibility reports",
      "Complete 108-day manifestation blueprint",
    ],
    recommendedFor: [
      "Clients desiring VIP-level support and custom spellwork",
      "Business leaders, entrepreneurs, and high-manifestors",
    ],
    durations: [
      { name: "Monthly", months: 1, benefits: "+ all features of basic subscription", priceMultiplier: 1 },
      { name: "3 Months", months: 3, benefits: "+ all features of basic subscription + all tarot subscription", priceMultiplier: 3 },
      { name: "6 Months", months: 6, benefits: "All features of tarot subscription + 6 Bonus Healings (on call) + 1 Full Chakra Alignment (7-session series)(video recorded) + 1 Personalized ritual Manual + 3 Cord-Cutting sessions across the year(or aura cleansing, according to need) + 2 video call healing sessions + 1 gift", priceMultiplier: 6 },
      { name: "Yearly", months: 12, benefits: "ULTIMATE ACCESS: ✔ 12 Major Rituals + 4 Bonus Rituals | ✔ 1 Mega Ritual (Money / Life Purpose / Business Boost) | ✔ 1 Astrological kundali analysis + totkas | ✔ 1 Astrology Compatibility Report | ✔ 108-Day Manifestation Plan | ✔ VIP Hotline + Same-day replies | ✔ Personalized Bracelet/Crystal | ✔ all features included in 6 month subscription", priceMultiplier: 12 },
    ],
    includedServices: [
      {
        name: "Major Ritual",
        description: "Intense manifestation ritual conducted for your specific intention.",
        sessions: "1 per month",
      },
    ],
    faqs: [
      {
        question: "Is the personalized bracelet included?",
        answer: "Yes, a customized crystal/bracelet tailored to your energy configuration is shipped as part of the Yearly package.",
      },
    ],
  },
];
