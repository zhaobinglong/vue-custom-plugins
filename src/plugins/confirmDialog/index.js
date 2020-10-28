import vue from 'vue'
import confirmComponent from './index.vue'

// 申明一个空对象
var Confirm={}

// 给空对象添加install方法，vue的use方法会自动寻找install方法
Confirm.install=function (vue) {
  // 利用模板构造一个实例
  let ConfirmConstructor = vue.extend(confirmComponent)

  // 利用实例new一个dom元素出来
  let ConfirmDom=new ConfirmConstructor()
  let tpl=ConfirmDom.$mount().$el
  
  // 将dom元素append到body
  document.body.appendChild(tpl)
  
  // 在vue原型链上挂载调用插件的方法，options就是外部调用时候传递的参数
  vue.prototype.$confirmDialog=function (options) {

    // 插件自身的参数，插件对外暴露的所有数据
    let opt={
      title:'提醒',
      content:'',
      confirmText:'确定',
      cancelText:'取消',
      showCancel:true,
      success:'',
      fail:''
    }
    
    //  插件有自己默认的参数，利用Object.assign，将外部传入的参数覆盖插件自身的参数
    Object.assign(opt,options)
    
    // 调用插件自身的show方法，显示插件
    ConfirmDom.show(opt)

  }

}

export default Confirm