<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return{
      b:false,
      CLIENT_LIST: [],
    }
  },
  destroyed: function () { // 离开页面生命周期函数
  },
  created () {
    if (!this.b){
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("user") ) {
        //replaceState替换状态的意思 //assign分配//target目标
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("user"))))
      }
      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("user",JSON.stringify(this.$store.state));
      });
      this.b=true;
    }
    if (this.b){

      this.b=false;
    }

  }

}
</script>

<style>

</style>
