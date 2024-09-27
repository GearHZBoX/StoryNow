export default {
	state: {
		stack: [],
		scrollDistance: 0,
		displayNextText: true,
	},
	getters: {
		size: state => state.stack.length,
		getScrollTop: state => id => {
			const story = state.stack.find(item => item._id === id);
			return story?.scrollTop;
		},
	},
	mutations: {
		pushReaderStack: (state, payload) => state.stack.push(payload),
		popReaderStack: (state) => state.stack.pop(),
		shiftReaderStack: (state) => state.stack.shift(),
		unshiftReaderStack: (state, payload) => state.stack.unshift(payload),
		clearReaderStack: (state) => {
			state.stack = [];
		},
		setDisplayNextText: (state, payload) => state.displayNextText = payload,
		setScrollTop: (state, { id, scrollTop }) => {
			const story = state.stack.find(({ _id }) => _id === id);
			if (story) {
				story.scrollTop = scrollTop;
			}
		}
	},
	actions: {

	}
}