/** Common “hello” greetings — curated from open multilingual greeting lists */
export type Greeting = {
  text: string;
  language: string;
};

export const WORLD_GREETINGS: Greeting[] = [
  { text: "hello", language: "English" },
  { text: "hallo", language: "German / Dutch" },
  { text: "hola", language: "Spanish" },
  { text: "bonjour", language: "French" },
  { text: "ciao", language: "Italian" },
  { text: "olá", language: "Portuguese" },
  { text: "hej", language: "Swedish" },
  { text: "hei", language: "Norwegian / Finnish" },
  { text: "halló", language: "Icelandic" },
  { text: "cześć", language: "Polish" },
  { text: "ahoj", language: "Czech" },
  { text: "merhaba", language: "Turkish" },
  { text: "salam", language: "Persian / Arabic" },
  { text: "shalom", language: "Hebrew" },
  { text: "namaste", language: "Hindi" },
  { text: "namaskar", language: "Nepali" },
  { text: "nihao", language: "Chinese (pinyin)" },
  { text: "你好", language: "Chinese" },
  { text: "こんにちは", language: "Japanese" },
  { text: "안녕하세요", language: "Korean" },
  { text: "xin chào", language: "Vietnamese" },
  { text: "sawasdee", language: "Thai" },
  { text: "halo", language: "Indonesian" },
  { text: "kamusta", language: "Filipino" },
  { text: "jambo", language: "Swahili" },
  { text: "habari", language: "Swahili" },
  { text: "privet", language: "Russian" },
  { text: "γεια", language: "Greek" },
  { text: "aloha", language: "Hawaiian" },
  { text: "ia orana", language: "Tahitian" },
];

/** Final greeting that matches the portfolio panda banner */
export const FINAL_GREETING: Greeting = { text: "hi", language: "English" };
