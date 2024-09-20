export default {
	state: {
		stack: [],
	},
	getters: {
	
	},
	mutations: {
		pushReaderStack: (state, payload) => state.stack.push(payload),
		popReaderStack: (state) => state.stack.pop(),
		shiftReaderStack: (state) => state.stack.shift(),
		unshiftReaderStack: (state, payload) => state.stack.unshift(payload),
		clearReaderStack: (state) => {
			state.stack = [];
		},
	},
	actions: {

	}
}