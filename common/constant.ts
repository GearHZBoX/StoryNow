export const SEARCH_HISTORY_STORAGE_KEY = 'search-history';

export const isIOS = uni.getSystemInfoSync().platform == "ios";
export const isAndroid = uni.getSystemInfoSync().platform == "android";

export const placeholderStyle = `
	color: var(--light-text-gray04, #C0C0CC);
	font-family: "Open Sans";
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px;
`;