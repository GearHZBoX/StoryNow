import { map, isNil } from 'lodash';

export function goBackToLatestReaderPage() {
	const pageStack = map(getCurrentPages(), 'route');
	if (pageStack.length <= 1) {
		return;
	}
	const regexp = /^pages\/reader\/reader/;
	
	let readerIndex;
	
	let cursor = pageStack.length;
	while(cursor >= 0) {
		if (regexp.test(pageStack[cursor])) {
			readerIndex = cursor;
			break;
		}
		cursor--;
	}
	
	if (isNil(readerIndex)) {
		console.log('no reader in stack');
		return false;
	}
	
	const delta = pageStack.length - 1 - readerIndex;
	
	uni.navigateBack({ delta });
	
	return true;
}