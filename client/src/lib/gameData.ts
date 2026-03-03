// CDN URLs for all images
export const IMAGES = {
  nawwar: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar_95fbe128.png",
  mrMuhim: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/mr_muhim_dac0e96e.png",
  nouriya: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nouriya_69583a22.png",
  saleh: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/saleh_c8007fea.png",
  bird: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/bird_mascot_7efa08af.png",
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/school_logo_70228053.png",
  storyCover: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/story_cover_c845feba.webp",
  storyP3: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/story_p3_8402185d.webp",
  storyP8: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/story_p8_b84ebd57.webp",
  storyP14: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/story_p14_b5f15915.webp",
  storyP17: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/story_p17_6972d49d.webp",
  storyP18: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/story_p18_8d476959.webp",
};

export interface Question {
  id: number;
  questionAr: string;
  questionEn: string;
  type: "mcq" | "truefalse" | "drag";
  options?: { ar: string; en: string }[];
  correctAnswer: number; // index for mcq, 0=true/1=false for truefalse
  image?: string;
  characterImage?: string;
}

export interface Station {
  id: number;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  characterImage: string;
  questions: Question[];
}

export const stations: Station[] = [
  {
    id: 1,
    nameAr: "بَيْتُ نَوَّارٍ",
    nameEn: "Nawwar's House",
    icon: "🏠",
    color: "#2563EB",
    characterImage: IMAGES.nawwar,
    questions: [
      {
        id: 1,
        questionAr: "مَنْ يُرَاقِبُ الْحَيَّ مِنَ الشُّرْفَةِ؟",
        questionEn: "Who watches the neighborhood from the balcony?",
        type: "mcq",
        options: [
          { ar: "السَّيِّدُ صَالِحٌ", en: "Mr. Saleh" },
          { ar: "نَوَّارٌ", en: "Nawwar" },
          { ar: "السَّيِّدُ مُهِمٌّ", en: "Mr. Muhim" },
        ],
        correctAnswer: 1,
        image: IMAGES.storyP3,
      },
      {
        id: 2,
        questionAr: "نَوَّارٌ يُرَاقِبُ الْحَيَّ مِنْ شُرْفَتِهِ كُلَّ يَوْمٍ.",
        questionEn: "Nawwar watches the neighborhood from his balcony every day.",
        type: "truefalse",
        correctAnswer: 0, // true
      },
      {
        id: 3,
        questionAr: "لِمَاذَا لَا يَخْرُجُ نَوَّارٌ مِنْ بَيْتِهِ كَثِيرًا؟",
        questionEn: "Why doesn't Nawwar leave his house often?",
        type: "mcq",
        options: [
          { ar: "لِأَنَّهُ كَسُولٌ", en: "Because he is lazy" },
          { ar: "لِأَنَّهُ مَرِيضٌ", en: "Because he is sick" },
          { ar: "لِأَنَّهُ خَائِفٌ", en: "Because he is scared" },
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 2,
    nameAr: "الشَّارِعُ الْعَاصِفُ",
    nameEn: "The Windy Street",
    icon: "🌬️",
    color: "#FF8C00",
    characterImage: IMAGES.mrMuhim,
    questions: [
      {
        id: 4,
        questionAr: "مَاذَا حَمَلَتِ الرِّيحُ؟",
        questionEn: "What did the wind carry?",
        type: "mcq",
        options: [
          { ar: "كُرَةً", en: "A ball" },
          { ar: "قَمِيصًا", en: "A shirt" },
          { ar: "كِتَابًا", en: "A book" },
        ],
        correctAnswer: 1,
        image: IMAGES.storyP8,
      },
      {
        id: 5,
        questionAr: "السَّيِّدُ مُهِمٌّ رَجُلٌ كَثِيرُ الْكَلَامِ.",
        questionEn: "Mr. Muhim is a talkative man.",
        type: "truefalse",
        correctAnswer: 1, // false
      },
      {
        id: 6,
        questionAr: "مَا اسْمُ السَّيِّدِ مُهِمٍّ الْحَقِيقِيُّ؟",
        questionEn: "What is Mr. Muhim's real name?",
        type: "mcq",
        options: [
          { ar: "مَحْمُودٌ", en: "Mahmoud" },
          { ar: "مُصْطَفَى", en: "Mustafa" },
          { ar: "صَالِحٌ", en: "Saleh" },
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 3,
    nameAr: "أَسْمَاءُ الْإِشَارَةِ",
    nameEn: "Demonstrative Pronouns",
    icon: "👈",
    color: "#7C3AED",
    characterImage: IMAGES.bird,
    questions: [
      {
        id: 7,
        questionAr: "أَكْمِلْ: ______ وَلَدٌ طَيِّبٌ.",
        questionEn: "Complete: ______ is a good boy.",
        type: "mcq",
        options: [
          { ar: "هٰذِهِ", en: "hādhihi (this - fem.)" },
          { ar: "هٰذَا", en: "hādhā (this - masc.)" },
          { ar: "هٰؤُلَاءِ", en: "hā'ulā'i (these)" },
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        questionAr: "أَكْمِلْ: ______ شَجَرَةٌ كَبِيرَةٌ.",
        questionEn: "Complete: ______ is a big tree.",
        type: "mcq",
        options: [
          { ar: "هٰذَا", en: "hādhā (this - masc.)" },
          { ar: "ذٰلِكَ", en: "dhālika (that - masc.)" },
          { ar: "تِلْكَ", en: "tilka (that - fem.)" },
        ],
        correctAnswer: 2,
      },
      {
        id: 9,
        questionAr: "أَكْمِلْ: ______ أَطْفَالٌ سُعَدَاءُ.",
        questionEn: "Complete: ______ are happy children.",
        type: "mcq",
        options: [
          { ar: "هٰؤُلَاءِ", en: "hā'ulā'i (these)" },
          { ar: "هٰذَا", en: "hādhā (this - masc.)" },
          { ar: "تِلْكَ", en: "tilka (that - fem.)" },
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        questionAr: "أَكْمِلْ: ______ مَدْرَسَةٌ جَمِيلَةٌ.",
        questionEn: "Complete: ______ is a beautiful school.",
        type: "mcq",
        options: [
          { ar: "هٰذَا", en: "hādhā (this - masc.)" },
          { ar: "هٰذِهِ", en: "hādhihi (this - fem.)" },
          { ar: "أُولٰئِكَ", en: "ulā'ika (those)" },
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 4,
    nameAr: "الضَّمَائِرُ وَالْأَفْعَالُ",
    nameEn: "Pronouns & Verbs",
    icon: "👤",
    color: "#16A34A",
    characterImage: IMAGES.nouriya,
    questions: [
      {
        id: 11,
        questionAr: "أَكْمِلْ: ______ أَقْرَأُ الْقِصَّةَ.",
        questionEn: "Complete: ______ read the story. (I)",
        type: "mcq",
        options: [
          { ar: "أَنَا", en: "anā (I)" },
          { ar: "هُوَ", en: "huwa (he)" },
          { ar: "نَحْنُ", en: "naḥnu (we)" },
        ],
        correctAnswer: 0,
      },
      {
        id: 12,
        questionAr: "أَكْمِلْ: ______ يَلْعَبُ فِي الشَّارِعِ.",
        questionEn: "Complete: ______ plays in the street.",
        type: "mcq",
        options: [
          { ar: "هِيَ", en: "hiya (she)" },
          { ar: "هُوَ", en: "huwa (he)" },
          { ar: "أَنْتِ", en: "anti (you - fem.)" },
        ],
        correctAnswer: 1,
      },
      {
        id: 13,
        questionAr: "أَكْمِلْ: ______ تَطْبُخُ الطَّعَامَ.",
        questionEn: "Complete: ______ cooks the food.",
        type: "mcq",
        options: [
          { ar: "هُوَ", en: "huwa (he)" },
          { ar: "أَنْتَ", en: "anta (you - masc.)" },
          { ar: "هِيَ", en: "hiya (she)" },
        ],
        correctAnswer: 2,
      },
      {
        id: 14,
        questionAr: "أَكْمِلْ: ______ نَدْرُسُ فِي الْمَدْرَسَةِ.",
        questionEn: "Complete: ______ study at school. (We)",
        type: "mcq",
        options: [
          { ar: "أَنْتَ", en: "anta (you - masc.)" },
          { ar: "نَحْنُ", en: "naḥnu (we)" },
          { ar: "هُمْ", en: "hum (they)" },
        ],
        correctAnswer: 1,
      },
      {
        id: 15,
        questionAr: "أَكْمِلْ: ______ تَكْتُبُ الْوَاجِبَ.",
        questionEn: "Complete: ______ write the homework. (you - masc.)",
        type: "mcq",
        options: [
          { ar: "أَنْتَ", en: "anta (you - masc.)" },
          { ar: "هُوَ", en: "huwa (he)" },
          { ar: "أَنَا", en: "anā (I)" },
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 5,
    nameAr: "بَيْتُ السَّيِّدِ مَحْمُودٍ",
    nameEn: "Mr. Mahmoud's House",
    icon: "🎉",
    color: "#DC2626",
    characterImage: IMAGES.saleh,
    questions: [
      {
        id: 16,
        questionAr: "السَّيِّدُ صَالِحٌ صَاحِبُ مَطْعَمٍ.",
        questionEn: "Mr. Saleh owns a restaurant.",
        type: "truefalse",
        correctAnswer: 1, // false - he owns a grocery store
      },
      {
        id: 17,
        questionAr: "الْخَالَةُ نُورِيَّةُ تُحِبُّ نَبَاتَاتِهَا كَثِيرًا.",
        questionEn: "Aunt Nouriya loves her plants very much.",
        type: "truefalse",
        correctAnswer: 0, // true
      },
      {
        id: 18,
        questionAr: "رَكَضَ نَوَّارٌ خَلْفَ الْقَمِيصِ مَعَ الْجِيرَانِ.",
        questionEn: "Nawwar ran after the shirt with the neighbors.",
        type: "truefalse",
        correctAnswer: 1, // false - he doesn't leave his house
      },
      {
        id: 19,
        questionAr: "أَكْمِلْ: الْجِيرَانُ سَاعَدُوهُ، ______ طَيِّبُونَ.",
        questionEn: "Complete: The neighbors helped him, ______ are kind.",
        type: "mcq",
        options: [
          { ar: "هُوَ", en: "huwa (he)" },
          { ar: "نَحْنُ", en: "naḥnu (we)" },
          { ar: "هُمْ", en: "hum (they)" },
        ],
        correctAnswer: 2,
        image: IMAGES.storyP17,
      },
      {
        id: 20,
        questionAr: "أَكْمِلْ: ______ بَيْتٌ جَمِيلٌ. (لِلْبَعِيدِ)",
        questionEn: "Complete: ______ is a beautiful house. (far)",
        type: "mcq",
        options: [
          { ar: "هٰذَا", en: "hādhā (this)" },
          { ar: "ذٰلِكَ", en: "dhālika (that)" },
          { ar: "هٰذِهِ", en: "hādhihi (this - fem.)" },
        ],
        correctAnswer: 1,
      },
    ],
  },
];

export function getGrade(score: number, total: number): { ar: string; en: string; emoji: string } {
  const pct = (score / total) * 100;
  if (pct >= 90) return { ar: "مُمْتَازٌ", en: "Excellent", emoji: "🌟" };
  if (pct >= 75) return { ar: "جَيِّدٌ جِدًّا", en: "Very Good", emoji: "⭐" };
  if (pct >= 60) return { ar: "جَيِّدٌ", en: "Good", emoji: "👍" };
  return { ar: "حَاوِلْ مَرَّةً أُخْرَى", en: "Try Again", emoji: "💪" };
}
