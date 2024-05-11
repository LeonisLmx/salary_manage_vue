import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //定义全局变量
    state: {
        websock:null,
        message:[],
        count:"0",
        notice:[]
    },
    //改变state的值必须经过
    mutations: {
        WEBSOCKET_INIT(state,url){
            console.log(url);
            state.websock = new WebSocket(url);
            state.websock.onopen=function () {
                console.log("WebSocket连接成功");
            };
            state.websock.onmessage = function (e) {
                if (e.data.startsWith("C")) {
                    state.count = e.data;

                }
                else if (e.data.startsWith("系统通知")){
                    state.notice.push(e.data);
                    console.log(state.notice);
                }
                else {
                    state.message.push(JSON.parse(e.data));
                    // console.log(state.message);
                }

            };
            state.websock.onerror= function () {
                console.log("WebSocket连接发生错误");
            };
            state.websock.onclose =  function (e) {
                console.log("connection closed (" + e.code + ")");
            };
        },
        WEBSOCKET_SEND(state,msg){
            state.websock.send(msg);
        },
        WEBSOCKET_CLOSE(state){
            state.websock.close();
        }
    },
    actions: {
        websocket_init({commit}, url) {
            commit('WEBSOCKET_INIT', url)
        },
        websocket_send({commit}, msg) {
            commit('WEBSOCKET_SEND', msg)
        },
        websocket_close({commit}){
            commit('WEBSOCKET_CLOSE')
        }
    },
    modules: {
    }
})