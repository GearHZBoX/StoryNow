export const SEARCH_HISTORY_STORAGE_KEY = 'search-history';

export const isIOS = uni.getSystemInfoSync().platform == "ios";
export const isAndroid = uni.getSystemInfoSync().platform == "android";