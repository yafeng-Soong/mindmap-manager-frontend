import Vue from 'vue';
import Vuetify from 'vuetify';
import VuetifyToast from 'vuetify-toast-snackbar-ng'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'vuetify/dist/vuetify.min.css'

Vue.use(VuetifyToast, {
    x: 'center', // default
    y: 'top', // default
    color: 'info', // default
    icon: 'mdi-information',
    iconColor: '', // default
    classes: [
        'body-2'
    ],
    timeout: 3000, // default
    dismissable: true, // default
    multiLine: false, // default
    vertical: false, // default
    queueable: false, // default
    showClose: false, // default
    closeText: '', // default
    closeIcon: 'close', // default
    closeColor: '', // default
    slot: [], //default
    shorts: {
        custom: {
            color: 'purple'
        }
    },
    property: '$toast' // default
})

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi', // 默认值 - 仅用于展示目的
    },
});
