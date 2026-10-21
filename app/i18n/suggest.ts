import type { Locale } from './languages';

/**
 * The offer shown to a visitor whose browser prefers another of the site's
 * languages, written in that language (components/AppLangSuggest.vue). It is
 * here rather than in the dictionaries because only the page's own language
 * is loaded. Same wording as beenzer.xyz.
 */
export const SUGGEST: Record<Locale, { text: string; go: string; close: string }> = {
  en: { text: 'This page is also in English.', go: 'Read in English', close: 'No thanks' },
  es: { text: 'Esta página también está en español.', go: 'Leer en español', close: 'No, gracias' },
  fr: { text: 'Cette page existe aussi en français.', go: 'Lire en français', close: 'Non merci' },
  de: { text: 'Diese Seite gibt es auch auf Deutsch.', go: 'Auf Deutsch lesen', close: 'Nein danke' },
  it: { text: 'Questa pagina esiste anche in italiano.', go: 'Leggi in italiano', close: 'No, grazie' },
  pt: { text: 'Esta página também está em português.', go: 'Ler em português', close: 'Agora não' },
  nl: { text: 'Deze pagina is er ook in het Nederlands.', go: 'Lees in het Nederlands', close: 'Nee, bedankt' },
  tr: { text: 'Bu sayfanın Türkçesi de var.', go: 'Türkçe okuyun', close: 'Hayır, teşekkürler' },
  ru: { text: 'Эта страница есть и на русском.', go: 'Читать на русском', close: 'Нет, спасибо' },
  uk: { text: 'Ця сторінка є й українською.', go: 'Читати українською', close: 'Ні, дякую' },
  ar: { text: 'هذه الصفحة متوفرة أيضًا بالعربية.', go: 'اقرأ بالعربية', close: 'لا، شكرًا' },
  he: { text: 'הדף הזה זמין גם בעברית.', go: 'לקריאה בעברית', close: 'לא תודה' },
  hi: { text: 'यह पेज हिंदी में भी उपलब्ध है।', go: 'हिंदी में पढ़ें', close: 'नहीं, धन्यवाद' },
  th: { text: 'หน้านี้มีภาษาไทยด้วย', go: 'อ่านภาษาไทย', close: 'ไม่เป็นไร ขอบคุณ' },
  vi: { text: 'Trang này cũng có bằng tiếng Việt.', go: 'Đọc bằng tiếng Việt', close: 'Không, cảm ơn' },
  id: { text: 'Halaman ini juga tersedia dalam bahasa Indonesia.', go: 'Baca dalam bahasa Indonesia', close: 'Tidak, terima kasih' },
  'zh-cn': { text: '此页面也有简体中文版。', go: '阅读简体中文版', close: '不用了，谢谢' },
  'zh-tw': { text: '本頁也有繁體中文版。', go: '閱讀繁體中文版', close: '不用了，謝謝' },
  ja: { text: 'このページは日本語でも読めます。', go: '日本語で読む', close: 'いいえ、結構です' },
  ko: { text: '이 페이지는 한국어로도 볼 수 있어요.', go: '한국어로 보기', close: '괜찮아요' },
};
