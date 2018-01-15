
import axios from 'axios'
import qs from 'qs'
import { message } from 'antd';

var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");
var jsencrypt = require('jsencrypt');
var crypto = require('crypto-browserify');

const publicKey=`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEDtIRT57TJAfmub2RsIM32jdo
8ijsds/u1fpY6hwtkC01/LFJkNTXqSwvpaO5tp86o0SlzBHdF0WxPtsKqdc8F7kQ
uHm7hUTLX0zPGRdGCsy9q/PIGlVGAFTBSVXl+grmGGZuS1CHI13L/oulBGENQOxO
8r6D1RyPjt6z0BAndQIDAQAB
-----END PUBLIC KEY-----`;
 const signature ="hGfvuuDv9tzrPF5COj80CEBhzNArLdK7qbuBHXIsF4zl60++IkEoC7q32TXVReGRQwqQ6Q7WJ102nW/bYeiHCVMPb6KIqUBWvZ1wx94jEJr8Y3gh8IhxPoBCuF8+fbv8hSVi+rMQR/ZyfeMUpDNQurakh8AShGAsnFD94bG08jw=";
  var data = "VeJvCsorVfVGZPiag/Jfd57RcHkkGFlJ+3WcXjjXwEHugJHX9Hhwgnxq5CBjXI+tfRFyeBqi41Bmnxcl5RKzcZZUdQUCnH6boV5bDCAf+EXoKd35/m/EjPAWquNJBoEY3F3y4InicBx4KLF2DRvzsQmqZg7TiSV+uB5W58auuD8="
  const rsa_sha1_verify = function (k, m, s) {
      console.log("key:" + k);
      console.log("msg:" + m);
      console.log("sig:" + s);

      var verify = crypto.createVerify('RSA-SHA1');
      verify.update(m);
      return verify.verify(k, s);
};
console.log(rsa_sha1_verify(publicKey,data,signature));
function getNum(){  
  var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];  
  var nums="";  
  for(var i=0;i<16;i++){  
    var id = parseInt(Math.random()*61);  
    nums+=chars[id];  
  }  
  return nums;  
  }
//加密过程
function encryption(text,keyWord) {
  var encryptPK='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCF+0yX+YlImgGQqnPeSKYsNs9ndIyF7R3/koyiY8c18PN+pbEoOQk8CSpPF59+SEQO4KkyJaKlqSSyChuYaNKWW+2O3k6bA6iXhmoTWoTSIY2jZc5wOND3QrouW4SXCzwTmgxlwADiyFGBGnHJnrEebOKBOIPCLw5cH7y5VtcgvQIDAQAB';
 
  //AES,CBC加密
  let plaintText=JSON.stringify(text);
  var options = {
    iv: CryptoJS.enc.Utf8.parse(keyWord),
     mode: CryptoJS.mode.CBC,
     padding: CryptoJS.pad.Iso10126 
    }
    var key = CryptoJS.enc.Utf8.parse(keyWord);
    var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
    //数据
    var encryptedBase64Str = encryptedData.toString();
    //RSA加密
    var encryptRSA = new jsencrypt.JSEncrypt();
    encryptRSA.setPublicKey(encryptPK);
    //key的值
    var encrypted = encryptRSA.encrypt(keyWord);

    return {
      key:encrypted,
      encrypted:encryptedBase64Str
    }
}
console.log(encryption({  
  "name":"tb",  
  "password":"123456"  
}));

axios.interceptors.request.use(config => {
    // loading
    return config
  }, error => {
    return Promise.reject(error)
  })

  axios.interceptors.response.use(response => {
    return response
  }, error => {
    return Promise.resolve(error.response)
  })


function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    message.error(res.msg);
    return;
  }
  //如果接口统一规范好成功失败的返回情况，则可以使用这个方法进行封装
  // if (res.data && (!res.data.success)) {
  //   message(res.data.status)
  // }
  return res;
}

export default {
  post (url, data) {
    const key = getNum();
    return axios({
      method: 'post',
      // baseURL: 'https://cnodejs.org/api/v1',
      url,
      data: qs.stringify(encryption(data,key)),
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response);
      }
    ).then(
      (res) => {
        return checkCode(res);
      }
    )
  },
  get (url, params) {
    const user = JSON.parse(localStorage.getItem('user')).token;
    return axios({
      method: 'get',
      // baseURL: 'https://cnodejs.org/api/v1',
      url,
      params:{'Authorization':user,...params}, // get 请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}