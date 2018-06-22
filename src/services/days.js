import Vue from 'vue'

export default {
    getDays() {
        return Vue.axios.get('/days.json')
    }
}