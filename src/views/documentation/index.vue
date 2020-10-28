<template>
  <div >
    <!-- <p>预览</p> -->
    <!-- <div class="before"></div> -->
    
    <div class="container">
      <div class="img-container">
        <img src="/partFour0.png" ref="image" alt=""> 
      </div>
<!--       <div class="afterCropper">
        <img :src="afterImg" alt="">
      </div> -->
    </div>
    <el-button style="margin: 30px auto;" type="error" @click="start">开始</el-button>
    <el-button style="margin: 30px auto;" type="error" @click="sureSava">裁剪</el-button>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'HelloWorld',
  data () {
    return {
      myCropper: null,
      afterImg: ''
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    start() {
      this.myCropper = new Cropper(this.$refs.image, {
        viewMode: 2,
        dragMode: 'none',
        initialAspectRatio: 1,
        // aspectRatio: 1,
        // preview: '.before',
        background: false,
        autoCropArea: 0.6,
        zoomOnWheel: false,
      })
    },
    // init(){

    // },
    sureSava(){
      this.afterImg = this.myCropper.getCroppedCanvas({
        imageSmoothingQuality: 'high'
      }).toDataURL('image/jpeg')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  display: flex;
}
.before{
  width: 100px;
  height: 100px;
  overflow: hidden;
  /* 这个属性可以得到想要的效果 */
}
.img-container{
  height: 400px;
  overflow: hidden;
}
.afterCropper{
  flex: 1;
  margin-left: 20px;
  border: 1px solid salmon; 
  text-align: center;
}
.afterCropper img{
  width: 150px;
  margin-top: 30px;
}
</style>