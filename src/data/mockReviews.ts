import { Review, IssueCategoryStat, IssueCategory, Sentiment, UrgencyLevel, AiDraftTone } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-101',
    author: 'Elena Rostova',
    platform: 'google',
    rating: 1,
    date: '2026-08-29',
    relativeTime: '18m ago',
    text: 'EXTREMELY DANGEROUS: I explicitly warned the server twice about my severe peanut allergy before ordering the chef special. 20 minutes in, my throat began swelling and I had to administer my EpiPen in the restroom. We had to rush to urgent care. When my husband spoke to the manager, he was dismissive and said "it is written on the menu disclaimer". Unacceptable negligence!',
    sentiment: 'negative',
    category: 'service',
    urgency: 'high',
    urgencyReason: 'Severe anaphylaxis / medical emergency. Major legal liability & health safety violation risk.',
    status: 'pending',
    aiInsight: 'Customer is deeply distressed and alarmed over a severe allergen reaction, seeking immediate accountability and allergen safety assurance.',
    verifiedCustomer: true,
    orderReference: 'ORD-8941',
    aiDraft: {
      selectedTone: 'empathetic',
      confidenceScore: 0.98,
      rationale: 'High legal & health risk. Acknowledges severity immediately, expresses urgent concern, requests immediate direct contact with General Manager, avoids defensive admissions while prioritizing patron safety.',
      tones: {
        empathetic: 'Elena, we are deeply concerned to hear this and are immensely relieved you are safe. Severe allergic reactions are treated with the highest gravity in our establishment. Our General Manager is reviewing the kitchen log and shift record right now. Please connect with our management team directly so we can personally assist with medical documentation and investigate this thoroughly.',
        professional: 'Dear Elena, we take food safety and allergen disclosures with absolute seriousness. We have initiated an immediate internal review of our kitchen prep logs and staff protocols from this evening. Please connect with our management team directly so we can address your experience and take appropriate corrective actions.',
        conciliatory: 'Elena, we sincerely apologize for the alarming distress and emergency situation you endured. There is no excuse for failing to uphold allergen safety protocols. We want to speak with you and your husband immediately to ensure you are fully cared for. Please reach out to our management team directly.',
        appreciative: 'Elena, thank you for bringing this urgent matter to our attention. We are investigating immediately to ensure strict compliance with allergen safety across all kitchen stations.',
      },
      currentText: 'Elena, we are deeply concerned to hear this and are immensely relieved you are safe. Severe allergic reactions are treated with the highest gravity in our establishment. Our General Manager is reviewing the kitchen log and shift record right now. Please connect with our management team directly so we can personally assist with medical documentation and investigate this thoroughly.',
    },
  },
  {
    id: 'rev-102',
    author: 'Marcus Vance',
    platform: 'yelp',
    rating: 2,
    date: '2026-08-29',
    relativeTime: '1h ago',
    text: 'We came here for our 10th anniversary after booking 3 weeks in advance. When we arrived on time, the host told us our table was given away to a private VIP party and offered us a cramped high-top next to the kitchen dish rack. Service took 45 minutes just to get water. Really ruined a special milestone evening.',
    sentiment: 'negative',
    category: 'service',
    urgency: 'high',
    urgencyReason: 'Milestone event ruined due to reservation failure. High PR / viral negative review risk.',
    status: 'pending',
    aiInsight: 'Customer feels hurt and neglected over a ruined milestone anniversary, seeking genuine acknowledgment of the reservation failure.',
    verifiedCustomer: true,
    orderReference: 'RES-4420',
    aiDraft: {
      selectedTone: 'conciliatory',
      confidenceScore: 0.94,
      rationale: 'Acknowledges ruined anniversary celebration, validates frustration over reservation mismanagement, and extends a personalized invitation to make amends with dedicated table hosting.',
      tones: {
        empathetic: 'Marcus, happy 10th anniversary, and we are truly heartbroken that we fell so far short on such an important evening for you and your spouse. Holding a reservation is a sacred commitment. We would love the chance to host you properly for a complimentary anniversary dinner on us. Please contact our guest relations team directly.',
        professional: 'Dear Marcus, thank you for your feedback. We sincerely regret the reservation mishap and delayed table assignment on your 10th anniversary. We hold our reservation commitments to high standards and would welcome the opportunity to discuss this directly with you. Please reach out to our team.',
        conciliatory: 'Marcus, we sincerely apologize for disappointing you and your spouse on your 10th anniversary. You trusted us with your milestone celebration and we failed your expectations. I would appreciate the opportunity to make this right with a hosted dinner at our chef’s table. Please contact us directly so we can make arrangements.',
        appreciative: 'Marcus, thank you for sharing your feedback. While we are glad you chose us for your anniversary, we regret the table delays and look forward to regaining your trust.',
      },
      currentText: 'Marcus, we sincerely apologize for disappointing you and your spouse on your 10th anniversary. You trusted us with your milestone celebration and we failed your expectations. I would appreciate the opportunity to make this right with a hosted dinner at our chef’s table. Please contact us directly so we can make arrangements.',
    },
  },
  {
    id: 'rev-103',
    author: 'Devon Miller',
    platform: 'google',
    rating: 1,
    date: '2026-08-28',
    relativeTime: '3h ago',
    text: 'Checked my bank statement this morning and noticed your register charged my card $184.50 THREE separate times for a single $61.50 brunch bill! I tried calling the store four times this morning and nobody picks up the phone. If this is not reversed today I am filing a fraud dispute with Chase.',
    sentiment: 'negative',
    category: 'pricing',
    urgency: 'high',
    urgencyReason: 'Duplicate billing / chargeback threat. Financial dispute requiring rapid accounting resolution.',
    status: 'pending',
    aiInsight: 'Customer is anxious and frustrated by duplicate financial charges, seeking swift accounting reversal and confirmation.',
    verifiedCustomer: true,
    orderReference: 'TRX-9102',
    aiDraft: {
      selectedTone: 'professional',
      confidenceScore: 0.96,
      rationale: 'Direct financial resolution. Reassures customer of instant audit, requests transaction verification details, explains potential POS batch settlement hold, and provides direct accounting contact.',
      tones: {
        empathetic: 'Devon, we completely understand your frustration and apologize for the distress. Duplicate pending authorizations can happen during payment gateway syncs, but rest assured you will not be overcharged. Our finance team is ready to process an immediate void. Please reach out to us with your transaction time so we can resolve this right away.',
        professional: 'Dear Devon, thank you for alerting us. We treat transaction integrity with top priority. Multiple authorizations are typically temporary pending holds caused by POS network timeouts, but our accounting team is auditing this right now. Please connect with our team so we can instantly verify and ensure zero excess charges.',
        conciliatory: 'Devon, we apologize for the difficulty reaching our morning staff and for the duplicate charges on your statement. We are reviewing our payment logs right now to release any duplicate authorization holds immediately. Please reach out to us so we can expedite this with your bank.',
        appreciative: 'Devon, thank you for bringing this payment discrepancy to our attention. Our accounting department is actively rectifying this on our payment terminal.',
      },
      currentText: 'Dear Devon, thank you for alerting us. We treat transaction integrity with top priority. Multiple authorizations are typically temporary pending holds caused by POS network timeouts, but our accounting team is auditing this right now. Please connect with our team so we can instantly verify and ensure zero excess charges.',
    },
  },
  {
    id: 'rev-104',
    author: 'Aria Chen',
    platform: 'facebook',
    rating: 5,
    date: '2026-08-28',
    relativeTime: '5h ago',
    text: 'Hands down the best dining experience in the neighborhood! The braised short rib melted in your mouth, the cocktails were balanced to perfection, and our server Jordan anticipated every single thing we needed without hovering. Absolutely spotless dining room too. We will be weekly regulars!',
    sentiment: 'positive',
    category: 'quality',
    urgency: 'low',
    status: 'replied',
    aiInsight: 'Customer is enthusiastic and delighted by exceptional culinary quality and attentive service, eager to become a loyal regular.',
    verifiedCustomer: true,
    reply: {
      text: 'Aria, thank you so much for the glowing review! We are delighted to hear you loved the braised short rib and that Jordan gave you five-star hospitality. We cannot wait to welcome you back for your next visit!',
      postedAt: '2026-08-28 16:30',
      toneUsed: 'appreciative',
    },
    aiDraft: {
      selectedTone: 'appreciative',
      confidenceScore: 0.99,
      rationale: 'Enthusiastic positive review. Reinforces brand loyalty, highlights staff recognition (Jordan), and encourages repeat visits.',
      tones: {
        empathetic: 'Aria, your kind words truly warm our hearts! We strive to make every visit feel like home, and we are so grateful for your support.',
        professional: 'Dear Aria, thank you for taking the time to share your feedback. We are pleased to know our culinary team and Jordan met your expectations.',
        conciliatory: 'Aria, thank you so much! We are thrilled everything was to your satisfaction and look forward to serving you again.',
        appreciative: 'Aria, thank you so much for the glowing review! We are delighted to hear you loved the braised short rib and that Jordan gave you five-star hospitality. We cannot wait to welcome you back for your next visit!',
      },
      currentText: 'Aria, thank you so much for the glowing review! We are delighted to hear you loved the braised short rib and that Jordan gave you five-star hospitality. We cannot wait to welcome you back for your next visit!',
    },
  },
  {
    id: 'rev-105',
    author: 'Mateo Morales',
    platform: 'appstore',
    rating: 3,
    date: '2026-08-27',
    relativeTime: '1d ago',
    text: 'Food flavor was solid (the truffle pasta was delicious), but the mobile app crashed twice when trying to add extra dessert items to our table tab. Also waited about 25 minutes for the physical bill. Good vibe, but the digital ordering flow could be much smoother.',
    sentiment: 'neutral',
    category: 'pricing',
    urgency: 'medium',
    urgencyReason: 'Portion-to-price ratio critique & mild service pacing delay.',
    status: 'pending',
    aiInsight: 'Customer appreciates the food flavor but feels slighted by portion-to-value ratio and slow dessert pacing.',
    verifiedCustomer: false,
    aiDraft: {
      selectedTone: 'professional',
      confidenceScore: 0.91,
      rationale: 'Balanced neutral feedback. Validates appreciation for culinary taste while constructively addressing portion value and service pacing.',
      tones: {
        empathetic: 'Mateo, we appreciate your honest feedback. We are glad you enjoyed the truffle pasta flavors, but we hear you on the dessert wait and portion expectations. We are discussing our kitchen timing with our floor team to ensure smoother pacing throughout your meal.',
        professional: 'Dear Mateo, thank you for dining with us and sharing your review. We are pleased you enjoyed the truffle pasta. We have shared your comments regarding portion value and service pacing with our executive chef and dining room manager as we continually refine our offerings.',
        conciliatory: 'Mateo, thank you for the helpful feedback. We apologize for the delay in dessert service and understand your thoughts on portion sizes. We hope to welcome you back soon for an even smoother dining experience.',
        appreciative: 'Mateo, thank you for your review! We are glad you loved the truffle pasta and we appreciate your constructive notes on pacing.',
      },
      currentText: 'Dear Mateo, thank you for dining with us and sharing your review. We are pleased you enjoyed the truffle pasta. We have shared your comments regarding portion value and service pacing with our executive chef and dining room manager as we continually refine our offerings.',
    },
  },
  {
    id: 'rev-106',
    author: 'Samira Patel',
    platform: 'tripadvisor',
    rating: 2,
    date: '2026-08-27',
    relativeTime: '1d ago',
    text: 'The hostess at the front desk was scrolling on her phone with headphones in and rolled her eyes when we asked how long the wait would be for a table of four. The waitstaff later was nice, but first impressions matter. Unfriendly front door attitude set a bad tone for our dinner.',
    sentiment: 'negative',
    category: 'staff',
    urgency: 'medium',
    urgencyReason: 'Hostess conduct & customer greeting standards complaint.',
    status: 'pending',
    aiInsight: 'Customer is disheartened by an indifferent front-door reception, emphasizing the importance of hospitable first impressions.',
    verifiedCustomer: true,
    aiDraft: {
      selectedTone: 'empathetic',
      confidenceScore: 0.93,
      rationale: 'Focuses on hospitality training, validates that welcoming hospitality is essential, and commits to front-of-house staff coaching.',
      tones: {
        empathetic: 'Samira, thank you for letting us know. First impressions are everything, and what you described is completely contrary to the warm hospitality we expect from our team. We are addressing this directly with our host team in our daily briefing to ensure every guest is greeted with prompt attention and respect.',
        professional: 'Dear Samira, we appreciate your constructive feedback. Professionalism at our greeting station is a core expectation. We are conducting retraining with our host staff to ensure attentive guest service at all times.',
        conciliatory: 'Samira, we apologize that your arrival was met with indifference. We hold our front door team to high customer care standards and regret falling short. We hope to have the chance to welcome you properly on your next visit.',
        appreciative: 'Samira, thank you for bringing this front-of-house experience to our attention so we can improve our hospitality training.',
      },
      currentText: 'Samira, thank you for letting us know. First impressions are everything, and what you described is completely contrary to the warm hospitality we expect from our team. We are addressing this directly with our host team in our daily briefing to ensure every guest is greeted with prompt attention and respect.',
    },
  },
  {
    id: 'rev-107',
    author: 'Liam Henderson',
    platform: 'trustpilot',
    rating: 4,
    date: '2026-08-26',
    relativeTime: '2d ago',
    text: 'Ordered corporate catering for 40 people. Great craft beer selection and the wood-fired pizza crust is incredible! Only deduction is that the patio area was a bit cluttered with empty glassware when we arrived. Exceptional catering execution overall.',
    sentiment: 'positive',
    category: 'cleanliness',
    urgency: 'low',
    status: 'replied',
    aiInsight: 'Customer thoroughly enjoyed the food and beer selection, offering a friendly constructive note on patio turnover cleanliness.',
    verifiedCustomer: true,
    reply: {
      text: 'Liam, cheers for the great shoutout on our craft beers and pizza! We hear you on keeping the patio bused during rush hours and have increased patio check rounds for our weekend busers. See you next Friday!',
      postedAt: '2026-08-26 19:15',
      toneUsed: 'appreciative',
    },
    aiDraft: {
      selectedTone: 'appreciative',
      confidenceScore: 0.95,
      rationale: 'Positive with mild constructive observation. Celebrates high points and validates operational refinement.',
      tones: {
        empathetic: 'Liam, thank you for your thoughtful review! We are thrilled you enjoyed our craft beers and pizza, and we appreciate the note regarding patio bussing.',
        professional: 'Dear Liam, thank you for the 4-star review. We are pleased you had an enjoyable happy hour and have alerted our floor staff to keep patio tables promptly cleared.',
        conciliatory: 'Liam, thank you for the feedback. We appreciate your compliment on the food and will keep the patio spotless going forward.',
        appreciative: 'Liam, cheers for the great shoutout on our craft beers and pizza! We hear you on keeping the patio bused during rush hours and have increased patio check rounds for our weekend busers. See you next Friday!',
      },
      currentText: 'Liam, cheers for the great shoutout on our craft beers and pizza! We hear you on keeping the patio bused during rush hours and have increased patio check rounds for our weekend busers. See you next Friday!',
    },
  },
  {
    id: 'rev-108',
    author: 'Chloe Dupont',
    platform: 'google',
    rating: 1,
    date: '2026-08-25',
    relativeTime: '3d ago',
    text: 'Found a piece of hard sharp plastic embedded inside the seafood risotto. I almost swallowed it. When I showed it to the server, they simply took the plate away without offering a replacement or an apology. This is a severe food safety hazard.',
    sentiment: 'negative',
    category: 'quality',
    urgency: 'high',
    urgencyReason: 'Physical foreign object contamination in food. Immediate food safety protocol issue.',
    status: 'pending',
    aiInsight: 'Customer is appalled by a foreign object food hazard and unconcerned staff reaction, seeking urgent culinary safety investigation.',
    verifiedCustomer: true,
    orderReference: 'ORD-7719',
    aiDraft: {
      selectedTone: 'empathetic',
      confidenceScore: 0.99,
      rationale: 'Foreign object food hazard. Critical response priority. Reassures immediate supplier and kitchen audit, apologizes sincerely, requests direct contact with head of culinary operations.',
      tones: {
        empathetic: 'Chloe, we are deeply alarmed by this report and sincerely apologize for this distressing experience. Foreign objects in food are unacceptable. We have immediately halted that batch and are auditing our ingredient packaging and kitchen prep line. Please connect with our management team directly so we can investigate your order details.',
        professional: 'Dear Chloe, thank you for reporting this incident. We hold kitchen safety to strict standards and have opened an immediate investigation with our kitchen station and prep team. Please contact our team directly so we can obtain the necessary details and address this matter urgently.',
        conciliatory: 'Chloe, we offer our unreserved apologies for this unacceptable incident and how it was handled at your table. We want to speak with you directly to rectify this and ensure full accountability. Please reach out to us directly.',
        appreciative: 'Chloe, thank you for bringing this safety concern to our direct attention. We take this feedback with maximum urgency.',
      },
      currentText: 'Chloe, we are deeply alarmed by this report and sincerely apologize for this distressing experience. Foreign objects in food are unacceptable. We have immediately halted that batch and are auditing our ingredient packaging and kitchen prep line. Please connect with our management team directly so we can investigate your order details.',
    },
  },
  {
    id: 'rev-109',
    author: 'Zackary Thorne',
    platform: 'yelp',
    rating: 5,
    date: '2026-08-24',
    relativeTime: '4d ago',
    text: 'Best espresso martini and steak frites in town. Quick service even on a bustling Saturday night. The staff works like a well-oiled machine.',
    sentiment: 'positive',
    category: 'service',
    urgency: 'low',
    status: 'pending',
    aiInsight: 'Customer is thrilled by efficient service during peak rush hours and impressed by consistent food and drink execution.',
    verifiedCustomer: true,
    aiDraft: {
      selectedTone: 'appreciative',
      confidenceScore: 0.98,
      rationale: 'High praise for kitchen and floor execution. Reinforces staff pride and encourages future patron engagement.',
      tones: {
        empathetic: 'Zackary, knowing you had such a wonderful evening on a busy night makes our entire crew smile. Thank you for your review!',
        professional: 'Dear Zackary, thank you for your 5-star rating and recognition of our team’s dedication to prompt service.',
        conciliatory: 'Zackary, thank you for the wonderful feedback! We are thrilled you enjoyed your visit.',
        appreciative: 'Zackary, thank you so much for the 5-star review! Our team takes huge pride in keeping service smooth during busy weekend rushes. We look forward to mixing another espresso martini for you soon!',
      },
      currentText: 'Zackary, thank you so much for the 5-star review! Our team takes huge pride in keeping service smooth during busy weekend rushes. We look forward to mixing another espresso martini for you soon!',
    },
  },
  {
    id: 'rev-110',
    author: 'Nora Higgins',
    platform: 'google',
    rating: 3,
    date: '2026-08-23',
    relativeTime: '5d ago',
    text: 'Restrooms were out of hand soap and paper towels around 8 PM. Tables were wiped down well, but attention to basic washroom hygiene during peak dinner hours is needed.',
    sentiment: 'neutral',
    category: 'cleanliness',
    urgency: 'medium',
    urgencyReason: 'Restroom sanitation deficiency during peak operation hours.',
    status: 'pending',
    aiInsight: 'Customer is mildly disappointed by depleted restroom amenities during dinner rush, expecting higher baseline hygiene standards.',
    verifiedCustomer: false,
    aiDraft: {
      selectedTone: 'professional',
      confidenceScore: 0.92,
      rationale: 'Hygiene and amenity maintenance feedback. Acknowledges oversight and establishes hourly check routines.',
      tones: {
        empathetic: 'Nora, thank you for letting us know. Maintaining clean, fully stocked facilities is fundamental, and we apologize for the oversight during dinner rush. We have implemented 30-minute restroom log checks for our floor captains.',
        professional: 'Dear Nora, thank you for bringing this to our attention. We have reinforced our facility inspection schedule with our management staff to ensure amenities remain fully stocked at all times.',
        conciliatory: 'Nora, we apologize for the lack of supplies in the restroom during your visit. Cleanliness is a top priority and we are adjusting our restock intervals.',
        appreciative: 'Nora, thank you for the helpful observation. We appreciate your feedback as we work to keep our facilities in top shape.',
      },
      currentText: 'Dear Nora, thank you for bringing this to our attention. We have reinforced our facility inspection schedule with our management staff to ensure amenities remain fully stocked at all times.',
    },
  },
  {
    id: 'rev-111',
    author: 'Devon Miller',
    platform: 'googleplay',
    rating: 2,
    date: '2026-08-29',
    relativeTime: '2h ago',
    text: 'The Android table reservation feature gave us a confirmation screen, but when we showed up for dinner the restaurant had no record of our party. Prime rib was also lukewarm and oversalted. Not what we expected for an anniversary dinner.',
    sentiment: 'negative',
    category: 'uncategorized',
    urgency: 'medium',
    urgencyReason: 'Food quality and temperature issues on a premium menu dish.',
    status: 'pending',
    aiInsight: 'Customer disappointed by subpar culinary execution on a high-ticket entrée.',
    verifiedCustomer: true,
    orderReference: 'ORD-9102',
    aiDraft: {
      selectedTone: 'conciliatory',
      confidenceScore: 0.93,
      rationale: 'Addresses culinary temperature and recipe feedback, extending an invitation to make amends.',
      tones: {
        empathetic: 'Devon, we are truly sorry that the prime rib fell short in temperature and seasoning. We hold our kitchen to high culinary standards and would love the chance to treat you to an exceptional dining experience. Please connect with our management team directly.',
        professional: 'Dear Devon, thank you for bringing this to our attention. We have shared your feedback regarding the prime rib seasoning and temperature with our executive chef. Please reach out to us directly so we may address your experience.',
        conciliatory: 'Devon, we sincerely apologize that the prime rib was not up to our standard on your visit. We want to make this right. Please contact us directly so we can arrange a proper dinner on us.',
        appreciative: 'Devon, thank you for the constructive feedback on our prime rib and wine pairing. We look forward to exceeding your expectations next time.',
      },
      currentText: 'Devon, we sincerely apologize that the prime rib was not up to our standard on your visit. We want to make this right. Please contact us directly so we can arrange a proper dinner on us.',
    },
  },
  {
    id: 'rev-112',
    author: 'Rachel Lin',
    platform: 'yelp',
    rating: 2,
    date: '2026-08-28',
    relativeTime: '1d ago',
    text: 'We noticed a surprise $18 "kitchen wellness fee" tacked onto our final check without any prior notice on the physical menu or verbal warning from the host.',
    sentiment: 'negative',
    category: 'uncategorized',
    urgency: 'medium',
    urgencyReason: 'Surprise fee / billing transparency grievance.',
    status: 'pending',
    aiInsight: 'Customer seeks clear transparency regarding unannounced fee additions on their bill.',
    verifiedCustomer: true,
    orderReference: 'ORD-9044',
    aiDraft: {
      selectedTone: 'professional',
      confidenceScore: 0.95,
      rationale: 'Clarifies billing transparency and offers direct explanation and adjustment for the customer bill.',
      tones: {
        empathetic: 'Rachel, we understand your frustration regarding unexpected fee line items. Transparency is essential to trust, and we apologize for any confusion. Please reach out so we can adjust this for you directly.',
        professional: 'Dear Rachel, thank you for your feedback. We aim for complete billing transparency and apologize that our kitchen fee policy was not clearly communicated before your meal. Please contact our manager so we can assist you with your receipt.',
        conciliatory: 'Rachel, we apologize for the lack of upfront clarity on the bill fee. We would gladly review and refund that charge for you. Please email our management team directly.',
        appreciative: 'Rachel, thank you for raising this point on bill clarity. We are actively updating our table displays for full fee transparency.',
      },
      currentText: 'Dear Rachel, thank you for your feedback. We aim for complete billing transparency and apologize that our kitchen fee policy was not clearly communicated before your meal. Please contact our manager so we can assist you with your receipt.',
    },
  },
  {
    id: 'rev-113',
    author: 'Samira Patel',
    platform: 'facebook',
    rating: 2,
    date: '2026-08-27',
    relativeTime: '2d ago',
    text: 'Our server was visibly distracted, rolled his eyes when we asked for extra water glasses, and took 25 minutes just to bring our payment folio.',
    sentiment: 'negative',
    category: 'uncategorized',
    urgency: 'medium',
    urgencyReason: 'Staff attitude and payment delay complaint.',
    status: 'pending',
    aiInsight: 'Customer feels dismissed by discourteous server demeanor and delayed checkout.',
    verifiedCustomer: true,
    orderReference: 'ORD-8821',
    aiDraft: {
      selectedTone: 'empathetic',
      confidenceScore: 0.94,
      rationale: 'Validates customer frustration over staff attentiveness and hospitality standards.',
      tones: {
        empathetic: 'Samira, we are so sorry to hear about the discourteous service and payment delay you experienced. Genuine hospitality is our highest priority, and rolling eyes is unacceptable. We would appreciate the chance to speak with you directly.',
        professional: 'Dear Samira, thank you for sharing your feedback. We have addressed this directly with our service floor manager to ensure our hospitality standards are upheld. Please connect with our team so we can address your visit.',
        conciliatory: 'Samira, we apologize for the unprofessional behavior and checkout delays you encountered. We would welcome the chance to regain your trust with a hosted meal. Please reach out to us.',
        appreciative: 'Samira, thank you for helping us hold our team accountable to prompt, courteous guest service.',
      },
      currentText: 'Samira, we are so sorry to hear about the discourteous service and payment delay you experienced. Genuine hospitality is our highest priority, and rolling eyes is unacceptable. We would appreciate the chance to speak with you directly.',
    },
  },
];

export const ISSUE_CATEGORY_STATS: IssueCategoryStat[] = [
  {
    category: 'service',
    label: 'Service & Wait Times',
    count: 38,
    percentage: 34,
    trendPercentage: +14,
    positiveCount: 16,
    negativeCount: 15,
    neutralCount: 7,
  },
  {
    category: 'quality',
    label: 'Food & Product Quality',
    count: 29,
    percentage: 26,
    trendPercentage: -6,
    positiveCount: 18,
    negativeCount: 7,
    neutralCount: 4,
  },
  {
    category: 'pricing',
    label: 'Pricing & Billing',
    count: 19,
    percentage: 17,
    trendPercentage: +8,
    positiveCount: 4,
    negativeCount: 11,
    neutralCount: 4,
  },
  {
    category: 'staff',
    label: 'Staff Conduct & Attentiveness',
    count: 15,
    percentage: 13,
    trendPercentage: -12,
    positiveCount: 8,
    negativeCount: 5,
    neutralCount: 2,
  },
  {
    category: 'cleanliness',
    label: 'Cleanliness & Atmosphere',
    count: 11,
    percentage: 10,
    trendPercentage: -3,
    positiveCount: 7,
    negativeCount: 2,
    neutralCount: 2,
  },
];

// Dynamic issue category stats calculator based on current dataset & time range
export function getIssueStats(reviews: Review[], timeRange: '7d' | '30d' | '90d' | 'all' = '30d'): IssueCategoryStat[] {
  const categories: { category: IssueCategory; label: string; defaultTrend: number }[] = [
    { category: 'service', label: 'Speed & Table Wait Time', defaultTrend: 14 },
    { category: 'quality', label: 'Food Preparation & Taste', defaultTrend: 8 },
    { category: 'pricing', label: 'Billing & Overcharges', defaultTrend: -5 },
    { category: 'staff', label: 'Staff Conduct & Attentiveness', defaultTrend: -12 },
    { category: 'cleanliness', label: 'Cleanliness & Atmosphere', defaultTrend: -3 },
  ];

  const totalReviews = reviews.length || 1;

  return categories.map((cat) => {
    const catReviews = reviews.filter((r) => r.category === cat.category);
    const count = catReviews.length;
    const positiveCount = catReviews.filter((r) => r.sentiment === 'positive').length;
    const negativeCount = catReviews.filter((r) => r.sentiment === 'negative').length;
    const neutralCount = catReviews.filter((r) => r.sentiment === 'neutral').length;
    const percentage = Math.round((count / totalReviews) * 100);

    // Adjust trend slightly according to timeRange
    const multiplier = timeRange === '7d' ? 1.5 : timeRange === '90d' ? 0.7 : 1;
    const trendPercentage = Math.round(cat.defaultTrend * multiplier);

    return {
      category: cat.category,
      label: cat.label,
      count,
      percentage,
      trendPercentage,
      positiveCount,
      negativeCount,
      neutralCount,
    };
  }).sort((a, b) => b.count - a.count);
}

// Generate realistic daily trend points based on time range
export function getDailyTrend(reviews: Review[], timeRange: '7d' | '30d' | '90d' | 'all' = '30d') {
  const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 14 : timeRange === '90d' ? 30 : 14;
  const points = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Count matching reviews on this date or generate consistent contextual volume
    const matching = reviews.filter((r) => r.date === dateStr);
    
    // Seed consistent realistic volume pattern for visual density
    const seed = (d.getDate() * 3 + d.getMonth() * 7 + i * 5) % 10;
    const baseTotal = 2 + (seed % 6);
    const total = matching.length > 0 ? matching.length + baseTotal : baseTotal;
    
    const positive = Math.max(1, Math.round(total * (0.45 + (seed % 3) * 0.1)));
    const negative = Math.max(0, Math.round(total * (0.25 - (seed % 2) * 0.05)));
    const neutral = Math.max(0, total - positive - negative);
    const avgRating = Number(((positive * 4.8 + neutral * 3 + negative * 1.5) / total).toFixed(1));

    points.push({
      date: dateStr,
      dayLabel,
      total,
      positive,
      neutral,
      negative,
      avgRating,
    });
  }

  return points;
}

// Platform distribution metrics
export function getPlatformStats(reviews: Review[]) {
  const platforms: { platform: Review['platform']; name: string }[] = [
    { platform: 'appstore', name: 'Apple App Store' },
    { platform: 'googleplay', name: 'Google Play Store' },
    { platform: 'trustpilot', name: 'Trustpilot Reviews' },
    { platform: 'google', name: 'Google Business' },
    { platform: 'yelp', name: 'Yelp Local' },
    { platform: 'facebook', name: 'Facebook Reviews' },
    { platform: 'tripadvisor', name: 'Tripadvisor' },
  ];

  const total = reviews.length || 1;

  return platforms.map((p) => {
    const platReviews = reviews.filter((r) => r.platform === p.platform);
    const count = platReviews.length;
    const repliedCount = platReviews.filter((r) => r.status === 'replied').length;
    const avgRating = count > 0 
      ? Number((platReviews.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1))
      : 4.2;
    const responseRate = count > 0 ? Math.round((repliedCount / count) * 100) : 85;

    return {
      platform: p.platform,
      name: p.name,
      count,
      percentage: Math.round((count / total) * 100),
      avgRating,
      responseRate,
    };
  });
}

// Star rating distribution calculation
export function getRatingDistribution(reviews: Review[]) {
  const total = reviews.length || 1;
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const matching = reviews.filter((r) => r.rating === stars);
    const count = matching.length;
    const percentage = Math.round((count / total) * 100);
    return {
      stars,
      count,
      percentage,
    };
  });
  return distribution;
}

// Urgency severity breakdown
export function getUrgencyStats(reviews: Review[]) {
  const total = reviews.length || 1;
  const high = reviews.filter((r) => r.urgency === 'high').length;
  const medium = reviews.filter((r) => r.urgency === 'medium').length;
  const low = reviews.filter((r) => r.urgency === 'low').length;

  return {
    high: { count: high, percentage: Math.round((high / total) * 100) },
    medium: { count: medium, percentage: Math.round((medium / total) * 100) },
    low: { count: low, percentage: Math.round((low / total) * 100) },
    total,
  };
}
export function analyzeReviewOffline(
  text: string,
  rating: number,
  author: string,
  platform: Review['platform']
): Review {
  const lower = text.toLowerCase();

  // Sentiment detection
  let sentiment: Sentiment = 'neutral';
  if (rating >= 4 || (rating === 3 && (lower.includes('great') || lower.includes('love') || lower.includes('best')))) {
    sentiment = 'positive';
  } else if (rating <= 2 || lower.includes('terrible') || lower.includes('worst') || lower.includes('hazard') || lower.includes('unacceptable') || lower.includes('danger')) {
    sentiment = 'negative';
  }

  // Issue category detection
  let category: IssueCategory = 'service';
  if (lower.includes('clean') || lower.includes('restroom') || lower.includes('dirty') || lower.includes('trash') || lower.includes('smell') || lower.includes('soap')) {
    category = 'cleanliness';
  } else if (lower.includes('price') || lower.includes('charge') || lower.includes('bill') || lower.includes('cost') || lower.includes('expensive') || lower.includes('receipt') || lower.includes('refund')) {
    category = 'pricing';
  } else if (lower.includes('staff') || lower.includes('host') || lower.includes('rude') || lower.includes('server') || lower.includes('manager') || lower.includes('attitude') || lower.includes('waiter')) {
    category = 'staff';
  } else if (lower.includes('food') || lower.includes('dish') || lower.includes('taste') || lower.includes('cold') || lower.includes('raw') || lower.includes('flavor') || lower.includes('undercooked') || lower.includes('plastic') || lower.includes('hair') || lower.includes('steak') || lower.includes('pizza') || lower.includes('pasta')) {
    category = 'quality';
  } else {
    category = 'service';
  }

  // Urgency detection (Safety/Legal/Medical/Fraud triggers HIGH urgency regardless of stars)
  let urgency: UrgencyLevel = 'low';
  let urgencyReason: string | undefined;

  const highUrgencyKeywords = [
    'allergy', 'allergic', 'hospital', 'er', 'epipen', 'poison', 'sick', 'sickness',
    'sue', 'lawyer', 'legal', 'fraud', 'hazard', 'safety', 'choking', 'police',
    'discrimina', 'chargeback', 'health department', 'emergency'
  ];

  const mediumUrgencyKeywords = [
    'overcharge', 'waited 45', 'waited an hour', 'cold food', 'dirty', 'unfriendly',
    'anniversary', 'birthday', 'canceled', 'manager', 'rude'
  ];

  if (highUrgencyKeywords.some((k) => lower.includes(k))) {
    urgency = 'high';
    urgencyReason = 'Detected potential health/safety, legal liability, or critical dispute markers.';
  } else if (rating <= 2 || mediumUrgencyKeywords.some((k) => lower.includes(k))) {
    urgency = 'medium';
    urgencyReason = 'Substandard experience or unresolved customer frustration requires timely attention.';
  }

  const nameGreeting = author ? author.split(' ')[0] : 'Valued Guest';

  const tones: Record<AiDraftTone, string> = {
    empathetic: sentiment === 'positive'
      ? `${nameGreeting}, we are delighted to read your review! Knowing our guests have such a wonderful time makes our entire team's day. Thank you so much for your support!`
      : `${nameGreeting}, thank you for reaching out. We are sincerely sorry to learn about your experience with us. We hold ourselves to high standards and would appreciate the opportunity to make this right. Please connect with our team directly.`,
    professional: sentiment === 'positive'
      ? `Dear ${nameGreeting}, thank you for taking the time to share your feedback. We are pleased to know our team provided a positive experience and look forward to your next visit.`
      : `Dear ${nameGreeting}, thank you for your feedback. We treat all guest concerns regarding our ${category} with top priority and are conducting an internal check with our shift team. Please reach out if we can provide any additional assistance.`,
    conciliatory: sentiment === 'positive'
      ? `${nameGreeting}, thank you for the wonderful review! We are thrilled you had a memorable visit and we can't wait to serve you again.`
      : `${nameGreeting}, we apologize unreservedly for falling short of your expectations during your visit. Your feedback on our ${category} has been shared directly with our store management. Please connect with us directly so we can make amends.`,
    appreciative: sentiment === 'positive'
      ? `${nameGreeting}, thank you so much for the 5-star feedback! Your kind words mean the world to our crew. See you again very soon!`
      : `${nameGreeting}, thank you for bringing this to our attention. Constructive feedback allows us to continuously improve our team training and guest experience.`,
  };

  const selectedTone: AiDraftTone = sentiment === 'positive' ? 'appreciative' : urgency === 'high' ? 'empathetic' : 'professional';

  return {
    id: `rev-${Date.now().toString().slice(-4)}`,
    author: author || 'Anonymous Customer',
    platform,
    rating,
    date: new Date().toISOString().split('T')[0],
    relativeTime: 'Just now',
    text,
    sentiment,
    category,
    urgency,
    urgencyReason,
    status: 'pending',
    verifiedCustomer: true,
    aiDraft: {
      selectedTone,
      confidenceScore: 0.95,
      rationale: urgency === 'high'
        ? 'High urgency triage: Escalates to senior staff, validates customer safety/billing concern, and provides direct resolution avenue.'
        : sentiment === 'positive'
        ? 'Positive sentiment engagement: Reinforces patron loyalty and extends appreciation.'
        : 'Neutral/constructive review: Addresses specific category observations professionally.',
      tones,
      currentText: tones[selectedTone],
    },
  };
}
