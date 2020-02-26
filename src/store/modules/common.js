/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

const state = {
  nowLoading: false,
  showLayerPopup: false
}

const getters = {
 nowLoading: state => {
    return state.nowLoading
  },
  showLayerPopup: state => {
    return state.showLayerPopup
  }
}

const actions = {
  setNowLoading(context, value) {
    context.commit('setNowLoading', value)
  },
  setShowLayerPopup(context, value) {
    context.commit('setShowLayerPopup', value)
  }
}

const mutations = {
  setNowLoading(state, isLoading) {
    state.nowLoading = isLoading
  },
  setShowLayerPopup(state, showLayerPopup) {
    state.showLayerPopup = showLayerPopup
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
