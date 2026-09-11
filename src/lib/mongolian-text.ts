import { Difficulty, KeyLayoutInfo, AgeCategory, AgeCategoryInfo } from '../types';

export const AGE_CATEGORIES: AgeCategoryInfo[] = [
  {
    id: 'kids',
    nameMn: 'Бага анги',
    ageRange: '6–10 нас',
    subtitle: 'Бяцхан бичээчдийн зөөлөн ертөнц',
    description: 'Амьтад, үлгэр, эелдэг хөөрхөн үгстэй зөөлөн тайван уур амьсгал. Үсэг нүдлэх, гарын барил тавихад нэн тохиромжтой.',
    badgeEmoji: '🎈',
    recommendedWpm: '15 – 35 WPM',
    samplePreview: 'Нар ээж мишээж, цэцэгс дэлбээлээд өглөө бүхэн үлгэр шиг сайхан эхэлнэ.',
    features: ['Зөөлөн пастель өнгө төрх', 'Томруулсан уншихад хялбар үсэг', 'Урам өгөх өхөөрдөм дуу & эможи', 'Алдаагүй бичихэд чиглэсэн хөнгөн үгс'],
    theme: {
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      border: 'border-amber-400/40',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]',
    },
  },
  {
    id: 'middle',
    nameMn: 'Дунд анги',
    ageRange: '11–15 нас',
    subtitle: 'Танин мэдэхүй & Шинжлэх ухаан',
    description: 'Сансар огторгуй, байгаль, Монгол түүх домгийн сонирхолтой бичвэрүүдтэй танилцаж хурдаа ахиулна.',
    badgeEmoji: '🚀',
    recommendedWpm: '35 – 65 WPM',
    samplePreview: 'Нарны аймагт найман гараг эргэлддэг бөгөөд Монголын говь үлэг гүрвэлийн олдвороороо дэлхийд алдартай.',
    features: ['Сонирхолтой танин мэдэхүйн баримтууд', 'Хөгжилтэй хурдны уралдаан', 'Үгийн баялаг тэлэх өгүүлбэрүүд', 'Дэлхийн сонин хачин мэдээллүүд'],
    theme: {
      badgeBg: 'bg-sky-500/20',
      badgeText: 'text-sky-300',
      border: 'border-sky-400/40',
      glow: 'shadow-[0_0_20px_rgba(56,189,248,0.15)]',
    },
  },
  {
    id: 'high',
    nameMn: 'Ахлах анги',
    ageRange: '16–18 нас',
    subtitle: 'Уран зохиол & Эссэний Лиг',
    description: 'Гүн утга агуулгатай уран зохиолын эссэ, Монгол сэтгэлгээ, шүүмжлэлт өгүүлбэрүүдээр шалгалт, ЭЕШ-д бэлтгэнэ.',
    badgeEmoji: '📜',
    recommendedWpm: '55 – 90 WPM',
    samplePreview: 'Монгол хүний оюун санааны охь болсон эртний уран зохиолын өв соёл нь өнөөгийн бидэнд эх хэлний бахархлыг бэлэглэдэг.',
    features: ['Урт цогцолбор бүхий сонгодог эссэнүүд', 'Д.Нацагдорж, Б.Явуухулангийн бүтээлүүд', 'Шалгалт, эссэ бичих хурдны дасгалжуулагч', 'Цэг, таслал, дүрэм өндөр нарийвчлалтай'],
    theme: {
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300',
      border: 'border-emerald-400/40',
      glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]',
    },
  },
  {
    id: 'adult',
    nameMn: 'Насанд хүрэгчид',
    ageRange: '19+ нас',
    subtitle: 'Мэргэжлийн & Бизнес хурд',
    description: 'Мэдээлэл технологи, албан бичиг, бизнес харилцаа, дээд зэргийн хурд сорьсон сорилтууд.',
    badgeEmoji: '💼',
    recommendedWpm: '70 – 120+ WPM',
    samplePreview: 'Монгол улсын мэдээллийн технологи, хиймэл оюун ухаан ба цахим шилжилтийн бодлого нь байгууллагуудын өрсөлдөх чадварыг нэмэгдүүлж байна.',
    features: ['Албан хэрэг хөтлөлт, бизнес нэр томьёо', 'Код, тоо, тусгай тэмдэгтийн хослол', 'Өндөр дарамттай шуурхай бичлэг', 'Мэргэжлийн ажлын бүтээмж өсгөх'],
    theme: {
      badgeBg: 'bg-purple-500/20',
      badgeText: 'text-purple-300',
      border: 'border-purple-400/40',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    },
  },
];

// Kids soft, warm, friendly sentences and word pools
export const KIDS_EASY_WORDS = [
  'нар', 'сар', 'од', 'цэцэг', 'мод', 'зулзага', 'туулай', 'бамбарууш', 'муур', 'нохой',
  'шувуухай', 'бөмбөг', 'алим', 'жимс', 'чихэр', 'тоглоом', 'ээж', 'аав', 'ах', 'эгч',
  'дүү', 'сургууль', 'цэцэрлэг', 'зураг', 'дэвтэр', 'харандаа', 'дуу', 'инээмсэглэл', 'нархан', 'үүл'
];

export const KIDS_SENTENCES = [
  'Бяцхан цагаан туулай ногоон торгон өвсөнд баяртай тонгочин тоглоно.',
  'Өглөөний нар миний цонхоор дулаахан алтан туяагаа тусган инээмсэглэлээ.',
  'Ээж надад үлгэрийн гоё зурагтай шинэ үлгэрийн ном бэлэглэлээ.',
  'Бяцхан болжмор жиргэж, урин дулаан хаврын салхи зөөлөн үлээлээ.',
  'Би сургуульдаа дуртай, ангийнхаа олон найзуудтай эвтэй сайхан суралцдаг.',
  'Уулын тунгалаг горхи хоржигнон урсаж, жижигхэн мөнгөн загаснууд сэлнэ.',
  'Хөөрхөн бамбарууш ойд моддын дундуур амтат бөөрөлзгөнө түүж явна.',
  'Нар жаргаж тэнгэрт түмэн одод анивалзан үзэсгэлэнтэй гялалзаж эхлэв.',
  'Би аавдаа тусалж хашаандаа шинэ жимсний мод хамтдаа суулгалаа.'
];

// Middle school: Science, History, Curiosity
export const MIDDLE_SCHOOL_TEXTS = [
  'Дэлхийн хамгийн гүн цэнгэг уст нуур бол манай хөрш Хөвсгөл далайтай төстэй Байгал нуур юм.',
  'Сансрын хөлөг дэлхийн татах хүчийг ялан дийлж, одод түгсэн хязгааргүй огторгуйд амжилттай хөөрнө.',
  'Чингис хааны морьт цэргүүд өдөрт хэдэн зуун бээр газрыг морин өртөөний шуудангаар дамжин туулдаг байжээ.',
  'Монгол орон дэлхийн хамгийн ховор амьтдын нэг болох говийн мазаалай баавгайн цор ганц өлгий нутаг билээ.',
  'Нарны аймагт найман гараг нарыг тойрон өөр өөрийн тойрог замаар зогсолтгүй эргэлдэж байдаг.',
  'Хөлбөмбөг, сагсан бөмбөгийн багийн тоглолтод хамтын ажиллагаа болон хувийн ур чадвар тэгш чухал.',
  'Хүн анх гал асааж сурснаар байгалийн хатуу ширүүн хүйтнийг даван туулж, соёл иргэншил үүссэн түүхтэй.',
  'Компьютерийн код бичиж сурах нь шинэ гадаад хэл сурахтай адил логик сэтгэлгээг асар хурдтай хөгжүүлдэг.'
];

// High school: Deep literary essays, critical thinking, classic essays
export const HIGH_SCHOOL_ESSAYS = [
  'Хүмүүний амьдралын хамгийн эрхэм баялаг нь цаг хугацаа бөгөөд өнгөрсөн хором мөч бүрийг хичээл зүтгэл, эрдэм мэдлэгээр дүүргэх нь ирээдүйн их амжилтын бат бэх шав тулгуур болдог билээ. Эх хэл бол үндэстний оршин тогтнохуйн дархлаа, өв соёлын амьд гэрч юм.',
  'Д.Нацагдоржийн Миний нутаг бүтээлд өгүүлсэн Хэнтий, Хангай, Саяны өндөр сайхан нуруунууд, хөвч дэлхийн чимэг болсон ой тайга нь Монгол хүний зүрх сэтгэлд эх оронч бахархлын галыг мөнхөд асаадаг. Бид кирилл болон үндэсний бичгээ нандигнан суралцах учиртай.',
  'Нийгмийн хөгжил, техник технологийн дэвшлийн энэ эринд шүүмжлэлт сэтгэлгээ болон ёс суртахууны үнэт зүйлсийг хослуулан төлөвшүүлэх нь залуу үеийнхний өмнө тавигдаж буй томоохон сорилт мөн. Алдаанаасаа суралцаж, тууштай хөдөлмөрлөх зориг эрмэлзэл амжилтын эхлэл болно.',
  'Хүн төрөлхтний түүх бол мэдлэг, оюун ухааны төлөөх тасралтгүй эрэл хайгуулын түүх юм. Өөрийгөө танин мэдэж, сурсан мэдсэнээ бусдын сайн сайхны төлөө зориулж чадсан хүн л амьдралын жинхэнэ утга учрыг бүрэн дүүрэн мэдэрч чадна.',
  'Шинжлэх ухааны нээлтүүд, хиймэл оюуны хувьсал нь биднээс шинэ арга барил, уян хатан байдал, өдөр бүр тасралтгүй суралцах сэтгэлгээг шаардаж байна. Мэдлэг бол эрх чөлөөний жигүүр бөгөөд унших, бичих чадвар түүний тулгуур билээ.'
];

// Adults / Professional: IT, Business, Economy, Law
export const ADULT_PRO_TEXTS = [
  'Хиймэл оюун ухаан болон их өгөгдлийн шинжилгээ нь орчин үеийн бизнесийн шийдвэр гаргалтыг автоматжуулж, байгууллагын бүтээмжийг экспоненциал хэмжээгээр өсгөж байна. Технологийн дэд бүтцийн тогтвортой ажиллагаа зах зээлд өрсөлдөх давуу талыг бүрдүүлнэ.',
  'Монгол Улсын эдийн засгийн төрөлжилт, цахим засаглалын шилжилт болон хөрөнгө оруулалтын таатай орчныг бүрдүүлэхэд мэдээллийн технологийн өндөр мэргэшсэн хүний нөөц нэн чухал үүрэг гүйцэтгэнэ. Стратегийн төлөвлөлт үр ашгийг тодорхойлно.',
  'Компанийн засаглал, төслийн менежментийн стандартуудыг мөрдлөг болгон ажиллах нь байгууллагын урт хугацааны үнэ цэнийг хамгаалахад үндэс суурь болдог. Гэрээ эрх зүйн баталгаа болон эрсдэлийн удирдлага амжилтын гол шалгуур юм.',
  'Цахим аюулгүй байдал болон хэрэглэгчийн хувийн нууцлалын хамгаалалт нь өнөөгийн дижитал экосистемийн тэргүүлэх чиглэл болоод байна. Мэдээллийн шифрлэлт, үүлэн тооцооллын архитектур найдвартай ажиллагааг хангана.'
];

// Standard Mongolian Cyrillic Keyboard layout definition for visualizer
export const MONGOLIAN_KEYBOARD_LAYOUT: KeyLayoutInfo[][] = [
  // Number row
  [
    { key: '`', label: '№', shiftLabel: '`', code: 'Backquote', finger: 'pinky-l' },
    { key: '1', label: '1', shiftLabel: '!', code: 'Digit1', finger: 'pinky-l' },
    { key: '2', label: '2', shiftLabel: '\"', code: 'Digit2', finger: 'ring-l' },
    { key: '3', label: '3', shiftLabel: '№', code: 'Digit3', finger: 'mid-l' },
    { key: '4', label: '4', shiftLabel: ';', code: 'Digit4', finger: 'index-l' },
    { key: '5', label: '5', shiftLabel: ':', code: 'Digit5', finger: 'index-l' },
    { key: '6', label: '6', shiftLabel: '%', code: 'Digit6', finger: 'index-r' },
    { key: '7', label: '7', shiftLabel: '?', code: 'Digit7', finger: 'index-r' },
    { key: '8', label: '8', shiftLabel: '*', code: 'Digit8', finger: 'mid-r' },
    { key: '9', label: '9', shiftLabel: '(', code: 'Digit9', finger: 'ring-r' },
    { key: '0', label: '0', shiftLabel: ')', code: 'Digit0', finger: 'pinky-r' },
    { key: '-', label: '-', shiftLabel: '_', code: 'Minus', finger: 'pinky-r' },
    { key: '=', label: '=', shiftLabel: '+', code: 'Equal', finger: 'pinky-r' },
  ],
  // Top letter row (Ф Ц У Ж Э Н Г Ш Ү З К Ъ)
  [
    { key: 'q', label: 'ф', shiftLabel: 'Ф', code: 'KeyQ', finger: 'pinky-l' },
    { key: 'w', label: 'ц', shiftLabel: 'Ц', code: 'KeyW', finger: 'ring-l' },
    { key: 'e', label: 'у', shiftLabel: 'У', code: 'KeyE', finger: 'mid-l' },
    { key: 'r', label: 'ж', shiftLabel: 'Ж', code: 'KeyR', finger: 'index-l' },
    { key: 't', label: 'э', shiftLabel: 'Э', code: 'KeyT', finger: 'index-l' },
    { key: 'y', label: 'н', shiftLabel: 'Н', code: 'KeyY', finger: 'index-r' },
    { key: 'u', label: 'г', shiftLabel: 'Г', code: 'KeyU', finger: 'index-r' },
    { key: 'i', label: 'ш', shiftLabel: 'Ш', code: 'KeyI', finger: 'mid-r' },
    { key: 'o', label: 'ү', shiftLabel: 'Ү', code: 'KeyO', finger: 'ring-r' },
    { key: 'p', label: 'з', shiftLabel: 'З', code: 'KeyP', finger: 'pinky-r' },
    { key: '[', label: 'к', shiftLabel: 'К', code: 'BracketLeft', finger: 'pinky-r' },
    { key: ']', label: 'ъ', shiftLabel: 'Ъ', code: 'BracketRight', finger: 'pinky-r' },
  ],
  // Home row (Й Ы Б Ө А Х Р О Л Д П)
  [
    { key: 'a', label: 'й', shiftLabel: 'Й', code: 'KeyA', finger: 'pinky-l' },
    { key: 's', label: 'ы', shiftLabel: 'Ы', code: 'KeyS', finger: 'ring-l' },
    { key: 'd', label: 'б', shiftLabel: 'Б', code: 'KeyD', finger: 'mid-l' },
    { key: 'f', label: 'ө', shiftLabel: 'Ө', code: 'KeyF', finger: 'index-l' },
    { key: 'g', label: 'а', shiftLabel: 'А', code: 'KeyG', finger: 'index-l' },
    { key: 'h', label: 'х', shiftLabel: 'Х', code: 'KeyH', finger: 'index-r' },
    { key: 'j', label: 'р', shiftLabel: 'Р', code: 'KeyJ', finger: 'index-r' },
    { key: 'k', label: 'о', shiftLabel: 'О', code: 'KeyK', finger: 'mid-r' },
    { key: 'l', label: 'л', shiftLabel: 'Л', code: 'KeyL', finger: 'ring-r' },
    { key: ';', label: 'д', shiftLabel: 'Д', code: 'Semicolon', finger: 'pinky-r' },
    { key: "'", label: 'п', shiftLabel: 'П', code: 'Quote', finger: 'pinky-r' },
  ],
  // Bottom row (Я Ч Ё С М И Т Ь В Ю)
  [
    { key: 'z', label: 'я', shiftLabel: 'Я', code: 'KeyZ', finger: 'pinky-l' },
    { key: 'x', label: 'ч', shiftLabel: 'Ч', code: 'KeyX', finger: 'ring-l' },
    { key: 'c', label: 'ё', shiftLabel: 'Ё', code: 'KeyC', finger: 'mid-l' },
    { key: 'v', label: 'с', shiftLabel: 'С', code: 'KeyV', finger: 'index-l' },
    { key: 'b', label: 'м', shiftLabel: 'М', code: 'KeyB', finger: 'index-l' },
    { key: 'n', label: 'и', shiftLabel: 'И', code: 'KeyN', finger: 'index-r' },
    { key: 'm', label: 'т', shiftLabel: 'Т', code: 'KeyM', finger: 'index-r' },
    { key: ',', label: 'ь', shiftLabel: 'Ь', code: 'Comma', finger: 'mid-r' },
    { key: '.', label: 'в', shiftLabel: 'В', code: 'Period', finger: 'ring-r' },
    { key: '/', label: 'ю', shiftLabel: 'Ю', code: 'Slash', finger: 'pinky-r' },
  ]
];

// Mongolian Easy Word Pool
export const MONGOLIAN_WORDS_EASY = [
  'нар', 'сар', 'өдөр', 'шөнө', 'ус', 'гал', 'салхи', 'газар', 'тэнгэр', 'мод',
  'цэцэг', 'хүн', 'хүү', 'охин', 'ээж', 'аав', 'ах', 'эгч', 'дүү', 'гэр',
  'хот', 'аймаг', 'ном', 'үзэг', 'дэвтэр', 'сургууль', 'багш', 'зун', 'өвөл', 'хавар',
  'намар', 'маргааш', 'өнөөдөр', 'өчигдөр', 'морь', 'хонь', 'ямаа', 'үхэр', 'тэмээ', 'нохой',
  'муур', 'шувуу', 'зам', 'хоол', 'цай', 'сүү', 'талх', 'жимс', 'ногоо', 'алт',
  'мөнгө', 'зүрх', 'нүд', 'чих', 'гар', 'хөл', 'толгой', 'үс', 'нүүр', 'дуу'
];

// Mongolian Medium Word Pool (Compound words, modern terminology, expanded vowels)
export const MONGOLIAN_WORDS_MEDIUM = [
  'мэдээлэл', 'технологи', 'хөгжил', 'боловсрол', 'эрүүл', 'мэнд', 'ирээдүй', 'байгаль',
  'орчин', 'соёл', 'урлаг', 'түүх', 'уламжлал', 'судалгаа', 'шинжилгээ', 'интернет',
  'холбоо', 'систем', 'програм', 'компьютер', 'дэлгэц', 'хурд', 'нарийвчлал', 'амжилт',
  'хөдөлмөр', 'зорилго', 'хүсэл', 'мөрөөдөл', 'нөхөрлөл', 'хамтдаа', 'итгэл', 'найдвар',
  'эрх', 'чөлөө', 'шударга', 'ёс', 'энх', 'тайван', 'дэлхий', 'нийт',
  'байгууллага', 'төсөл', 'манлайлал', 'чадвар', 'боломж', 'шинэчлэл', 'бүтээлч', 'сэтгэлгээ',
  'туршлага', 'мэдлэг', 'өгөгдөл', 'аюулгүй', 'байдал', 'төхөөрөмж', 'дижитал', 'сүлжээ'
];

// Mongolian Hard & Expert Phrases, Sayings, Proverbs, and Literary Excerpts
export const MONGOLIAN_TEXTS_HARD = [
  'Эрдэм сурахад насны хязгаар үгүй, хичээнгүй зүтгэлд саад үгүй.',
  'Монгол хэлний баялаг сан хөмрөг нь өвөг дээдсийн үлдээсэн үнэт өв соёл билээ.',
  'Технологийн хурдацтай хувьсал дунд өөрийн ур чадварыг тасралтгүй хөгжүүлэх нь нэн чухал.',
  'Хүлэг морины хурд талын салхийг сөрөн давхихад эх нутгийн уудам орон цэлийж харагдана.',
  'Сайн үйлс бүхэн сэтгэлийн ариунаас эхэлж, хичээл зүтгэлээр үр дүнгээ өгдөг учиртай.',
  'Мэдээллийн эрин зуунд хурдан бөгөөд алдаагүй бичих чадвар нь бүтээмжийн тулгуур болдог.',
  'Өвлийн жавар тачигнаж, цасан цагаан тал алсын тэнгэрийн хаяатай нийлэн гялалзана.',
  'Эв нэгдэл бол аливаа улс үндэстэн хүчирхэгжин мандахын үндсэн бат бэх тулгуур юм.'
];

export const MONGOLIAN_TEXTS_EXPERT = [
  'Хөх тэнгэрийн дор хүмүүний амьдрал цэцэглэн, мөнхөд өөдлөн дэгжихийн ерөөл бат оршиж, ухаант өвгөдийн сургаал үеэс үед өвлөгдөн үлдэнэ.',
  'Шавьж баригч шар шувуу шар нарны гэрэлд шөнийн харанхуйг тэвчээртэй хүлээн сууна гэгчээр хүний хичээл зүтгэл цаг хугацааны сорилтыг даван гардаг.',
  'Оюун ухааны чадамж, гарын хурууны уран хөдөлгөөн, сэтгэл зүйн тэсвэр хатуужил хосолж байж хурдан бичээчийн дээд зэрэглэлд хүрдэг билээ.',
  'Аливаа бэрхшээлийг боломж хэмээн харж, алхам тутамдаа өөрийгөө сорин ялах нь жинхэнэ аварга хүний мөн чанар мөн.',
  'Тэртээх Алтайн сүрлэг оргилоос Халхын уудам тал хүртэл эх орны минь газар шороо эрдэнэсийн баялаг, түүхийн өлгий өлзийт нутаг билээ.'
];

// Helper to normalize Unicode strings (ensuring NFC consistency across browsers and OS)
export function normalizeMongolian(text: string): string {
  return text.normalize('NFC');
}

// Generate random prompt text based on difficulty, wordCount, and ageCategory
export function generateAgeCategoryPrompt(category: AgeCategory = 'high'): string {
  if (category === 'kids') {
    const randomIndex = Math.floor(Math.random() * KIDS_SENTENCES.length);
    return KIDS_SENTENCES[randomIndex];
  }
  if (category === 'middle') {
    const randomIndex = Math.floor(Math.random() * MIDDLE_SCHOOL_TEXTS.length);
    return MIDDLE_SCHOOL_TEXTS[randomIndex];
  }
  if (category === 'high') {
    const randomIndex = Math.floor(Math.random() * HIGH_SCHOOL_ESSAYS.length);
    return HIGH_SCHOOL_ESSAYS[randomIndex];
  }
  // adult
  const randomIndex = Math.floor(Math.random() * ADULT_PRO_TEXTS.length);
  return ADULT_PRO_TEXTS[randomIndex];
}

export function generateTypingPrompt(
  difficulty: Difficulty,
  wordCount: number = 25,
  ageCategory?: AgeCategory
): string {
  if (ageCategory) {
    if (ageCategory === 'kids' && difficulty === 'easy') {
      const shuffled = [...KIDS_EASY_WORDS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(wordCount, shuffled.length)).join(' ');
    }
    return generateAgeCategoryPrompt(ageCategory);
  }

  if (difficulty === 'easy') {
    const shuffled = [...MONGOLIAN_WORDS_EASY].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(wordCount, shuffled.length)).join(' ');
  }

  if (difficulty === 'medium') {
    const combined = [...MONGOLIAN_WORDS_EASY, ...MONGOLIAN_WORDS_MEDIUM].sort(() => 0.5 - Math.random());
    return combined.slice(0, Math.min(wordCount, combined.length)).join(' ');
  }

  if (difficulty === 'hard') {
    const randomIndex = Math.floor(Math.random() * MONGOLIAN_TEXTS_HARD.length);
    return MONGOLIAN_TEXTS_HARD[randomIndex];
  }

  // Expert
  const randomIndex = Math.floor(Math.random() * MONGOLIAN_TEXTS_EXPERT.length);
  return MONGOLIAN_TEXTS_EXPERT[randomIndex];
}

// Title progression definition based on level
export function getTitleForLevel(level: number): string {
  if (level >= 100) return 'Домогт Бичээч';
  if (level >= 75) return 'Талын Салхи';
  if (level >= 50) return 'Keyboard Master';
  if (level >= 25) return 'Төмөр хуруу';
  if (level >= 10) return 'Хурдан гар';
  return 'Шинэхэн';
}

// Experience point curve
export function getXpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.18, level - 1));
}
