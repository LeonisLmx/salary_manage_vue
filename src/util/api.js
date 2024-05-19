import axios from 'axios'
import {Message,MessageBox} from 'element-ui';
import router from '../router';

axios.interceptors.response.use(success => {
    if (success.status && success.status === 200 && success.data.status === 500) {
        Message.error({message: success.data.msg})
        return;
    } else if (success.status && success.status === 200 && success.data.status === 401) {
        Message.error({message: success.data.msg})
        router.replace('/login');
        return;
    } else if (success.status && success.status === 200 && success.data.status === 0) {
        MessageBox.alert('您的账号已经在另一台设备登录，怀疑您的密码已经泄露，建议您联系管理员修改密码', '提示', {
            confirmButtonText: '确定',
            callback: action => {
                Message({
                    type: 'warning',
                    message: success.data.msg
                });
                router.replace('/login');
            }
        });

    } else if (success.data.msg) {
        Message.success({message: success.data.msg})
    }
    return success.data;
}, error => {
    if (error.response.status === 504 || error.response.status === 404) {
        Message.error({message: '服务器被吃了( ╯□╰ )'})
    } else if (error.response.status === 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status == 401) {
        Message.error({message: '登录已过期，请重新登录'})
        router.replace('/login');
    }
    else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg})
        } else {
            Message.error({message: '未知错误!'})
        }
    }
    return;
})

let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}
