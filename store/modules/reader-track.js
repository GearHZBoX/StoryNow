export default {
	state: {
		stack: [],
	},
	getters: {
	
	},
	mutations: {
		push: (state, payload) => state.stack.push(payload),
		pop: (state) => state.stack.pop(),
		shift: (state) => state.stack.shift(),
		unshift: (state, payload) => state.stack.unshift(payload),
	},
	actions: {

	}
}