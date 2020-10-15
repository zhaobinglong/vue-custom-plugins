<!-- <template>
  <transition name="fade">
   <div class="confirm" v-show="isShow">
     <div class="confirm-content">
       <div class="title">{{confirm.title}}</div>
       <div class="content">{{confirm.content}}</div>
       <div class="btn-area">
         <div class="btn btn-primary" @click="onOk">{{confirm.confirmText}}</div>
         <div class="btn btn-default" v-if="confirm.showCancel" @click="onCancle">{{confirm.cancelText}}</div>
       </div>
     </div>

   </div>
  </transition>

</template> -->
<template>
  <div v-show="showDialog">
    <modal
      name="confirmDialogModal"
      :scrollable="true"
      :clickToClose="true"
      transition="pop-out"
      width="400"
      height="auto"
    >
      <div class="modal-title bg-gray-300 font-bold text-gray-33 items-center border-b">
        <h3 class="text-lg font-medium text-center">{{ confirm.title }}</h3>
      </div>
      <div class="text-center pt-8 px-8" v-if="confirm.content">{{confirm.content}}</div>
      <div class="w-full flex justify-center py-8">
        <button class="mx-6 btn btn-blue" @click="onOk">确定</button>
        <button class="mx-6 btn btn-white" @click="onCancle">取消</button>
      </div>
    </modal>
  </div>
</template>
<script>
export default {
  name:'Confirm',
  data:function () {
    return {
      confirm:{
         title:'请确认',
         content:'',
         confirmText:'确定',
         cancelText:'取消',
         showCancel:true,
         success:'',
         fail:''
      },
      showDialog: false
    }
  },
  methods:{
    onOk:function () {
      if(typeof(this.confirm.success)=='function'){
        this.confirm.success()
      }
      this.$modal.hide("confirmDialogModal");
    },
    onCancle:function () {
      if(typeof(this.confirm.fail)=='function'){
        this.confirm.fail()
      }
      this.$modal.hide("confirmDialogModal");
     },
    show:function (opt) {
      this.confirm=opt
      this.showDialog = true
      this.$nextTick(() => {
        this.$modal.show("confirmDialogModal");
      })
    }
  }
}

</script>
