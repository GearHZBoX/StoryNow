import { createStore } from 'vuex';
import readerTrack from './modules/reader-track';

const getInitialState = () => {
	
}

const store = createStore({
	state: getInitialState(),
	modules: {
		readerTrack,
	},
})

export default store;