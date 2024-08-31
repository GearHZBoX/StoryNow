import en from './en.json';
import zhHans from './zh-Hans.json';
import zhHant from './zh-Hant.json';

const messages = {
	en,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant,
};

export default {
	locale: uni.getLocale(),
	messages,
};