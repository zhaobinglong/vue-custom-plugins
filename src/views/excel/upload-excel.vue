<template>
  <div class="app-container" style="max-width: 570px;margin: 0 auto; padding-bottom: 50px">
    <h4 style="text-align: center;">Testing and Commissioning Procedure</h4>
    <el-form >
      <el-form-item label="Report title: ">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="RE Installation Address: ">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="CLP’s Application No: ">
        <el-input v-model="form.application"></el-input>
      </el-form-item>
      <el-form-item label="Power Rating (kW): ">
        <el-input v-model="form.rating"></el-input>
      </el-form-item>
      <el-form-item label="Current Rating (A): ">
        <el-input v-model="form.currentRating"></el-input>
      </el-form-item>
      <el-form-item label="No. of Phase: ">
        <el-input v-model="form.phase"></el-input>
      </el-form-item>
      <el-form-item label="Contact Person: ">
        <el-input v-model="form.contact"></el-input>
      </el-form-item>
      <el-form-item label="Phone Number: ">
        <el-input v-model="form.phoneNumber"></el-input>
      </el-form-item>
    </el-form>
    <p>3.2.Close <el-input v-model="form.input0" style="width: 240px"></el-input>4P isolation switch located at <el-input v-model="form.input1" style="width: 240px"></el-input> from the grid supply side.</p>
    <p>3.3.Close <el-input v-model="form.input2" style="width: 240px"></el-input>4P lockable isolation switch (Isolation Point) located at <el-input v-model="form.input3" style="width: 240px"></el-input>  from the RE system side.</p>
    <p>3.4.Close all the below switching devices in MCB board,</p>
    <p>3.4.1 <el-input v-model="form.input4" style="width: 240px"></el-input></p>
    <p><el-input v-model="form.input5" value="3.4.2" style="width: 70px"></el-input><el-input v-model="form.input6" style="width: 200px; margin-left: 10px"></el-input></p>
    <p><el-checkbox v-model="form.checked1" style="margin-right: 8px"></el-checkbox>Single Phase RE System (Please only provide test results for the connected phase L1/L2/L3)</p>
    <p><el-checkbox v-model="form.checked2" style="margin-right: 8px"></el-checkbox>Three Phase RE System (Please only provide test results for all three phase L1,L2 & L3)
(Remark: either one photo for all three phases test result or three separate photo for single phase results)</p>

    <!-- 一个数据结构的区块，包括抬头，图片，每张图片的描述和输入内容 -->
    <div v-for="(obj, key, i) in form.list">
      <h3>{{ obj.label }}</h3>
      <div v-for="(item, index) in obj.data" >
        <h3 v-if="item.appendTitle" >{{ item.appendTitle }}</h3>
        <el-select v-model="item.select" placeholder="請選擇" v-if="typeof item.options !== 'undefined' ">
          <el-option
            v-for="op in item.options"
            :key="op"
            :label="op"
            :value="op">
          </el-option>
        </el-select> 
        <!-- 只有一张大图 -->
        <div v-if="item.onlyImg">
          <el-image :src="publicPath + key + index + '.png' " class="avatar" lazy>
            <div slot="error" class="image-slot">
            </div>
          </el-image>          
        </div>
        <!-- 左边输入框，右边图片 -->
        <div v-else class="upload-line">
          <div class="upload-line-left">
            <p v-if="item.title" v-html="item.title"></p>         
            <el-input v-model="item.value" v-if="typeof item.value !=='undefined'">
              <template slot="append" v-if="item.symbol">{{ item.symbol }}</template>
            </el-input>
          </div>
          <el-upload
            class="avatar-uploader"
            :action="upload_url"
            :show-file-list="false"
            list-type="picture"
            :before-upload="beforeUpload"
            :on-success="(res) => { return uploadSuccess(res, index, key)}"
          >
            <el-image v-if="item.img" :src="item.img" class="avatar" lazy></el-image>
            <el-image v-else :src="publicPath + key + index + '.png' " class="avatar" lazy>
              <div slot="error" class="image-slot">
              </div>
            </el-image>
            <div v-if="item.img" class="avatar-remove" @click.stop="delPhoto(index, key)" ><i class="el-icon-delete-solid" style="color: red"/></div>
            <div v-if="item.img"  class="avatar-cute" @click.stop="cutePhoto(index, key)" >
              剪裁照片
            </div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="btn-save">
      <el-button type="text" @click="save">保存</el-button>
    </div>

    <!-- 剪裁容器 -->
    <div v-show="showCuteCanvas" style="position: fixed;top: 0;left: 0;right: 0;bottom: 50px;background: rgba(0,0,0,.8);display: flex; align-items: center;">
      <img id="image" :src="currentCutePhoto" crossOrigin='anonymous'>
      <div style="position: absolute; bottom: -50px;background-color: #000; width: 100%;line-height: 50px;display: flex;justify-content: space-around;">
        <el-button type="text"  @click="cuteCancel" style="width: 50%; height: 50px">取消</el-button>
        <el-button type="text"  @click="cuteConfirm" style="width: 50%; height: 50px">确定</el-button>
      </div>
      
    </div>

  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'
import { editDocument, getDocument } from '@/api/article'
import { uploadFile } from '@/api/file'
import { dataURItoBlob } from '@/utils/index'
import doc from './document.js'


export default {
  name: 'UploadExcel',
  components: { },
  data() {
    return {
      cropper: null, // 剪裁组件新建的对象
      croppable:false,  
      currentCutePhoto: '', // 当前被剪裁的那张照片
      showCuteCanvas: false, // 好片剪裁层
      fullscreenLoading: false,
      loading: null,
      publicPath: process.env.BASE_URL,
      upload_url: 'http://api.tncsoeasy.com/upload_alibaba_cloud.php',
      AntiIslandingtime1: '',
      tableData: [],
      tableHeader: [],
      form: doc,
      postData: {},
      tempPhoto: null, // 一个临时变量，用来记录当前剪切的照片的key和索引
    }
  },
  created() {
    getDocument({ id: this.$route.params.id }).then(res => {
      this.postData = res
      this.form = Object.assign({}, this.form , res.cont )
      this.form.title = res.title
    })
  },
  mounted () {  
  },  
  methods: {
    beforeUpload() {
      this.loading = this.$loading({
        lock: true,
        text: 'image upLoading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
    },
    uploadSuccess(response, index, key) {
      console.log(response)
      this.form.list[key].data[index].img = response.data.info.url
      this.fullscreenLoading = false
      this.loading.close()
      this.$forceUpdate() // 强制刷新
    },
    delPhoto(index, key) {
      this.form.list[key].data[index].img = ''
      this.$forceUpdate() // 强制刷新
    },
    // 开始剪裁照片
    cutePhoto(index, key) {
      this.showCuteCanvas = true
      this.currentCutePhoto = this.form.list[key].data[index].img
      this.tempPhoto = {
        key: key,
        index: index
      }
      this.$nextTick(() => {
        let image = document.getElementById('image');
        this.cropper = new Cropper(image, {
          viewMode: 2,
          dragMode: 'none',
          initialAspectRatio: 1,
          checkOrientation: false,
          // aspectRatio: 1,
          // preview: '.before',
          background: false,
          autoCropArea: 0.6,
          zoomOnWheel: false,
        });
      });
    },
    cuteConfirm () {
      let res = this.cropper.getCroppedCanvas({
        imageSmoothingQuality: 'low'
      }).toDataURL('image/jpeg')
      this.postUploadFile(res)
      this.cropper.destroy();
      this.cropper = null;
      this.showCuteCanvas = false
    },
    cuteCancel() {
      this.cropper.destroy();
      this.cropper = null;
      this.showCuteCanvas = false
    },

    // 剪裁后-文件上传-接口
    postUploadFile(base64) {
      //封装blob对象
      var blob = dataURItoBlob(base64);
      var fd = new FormData();
      fd.append("file", blob, '123.jpg');//fileData为自定义

      uploadFile(fd)
      .then(res => {
        console.log(res)
        this.form.list[this.tempPhoto.key].data[this.tempPhoto.index].img = res.info.url
        this.$forceUpdate() // 强制刷新
      })
      .catch(err => {console.log(err)})
    },

    save() {
      console.log(this.form)
      this.postData.cont = this.form
      this.postData.title = this.form.title
      editDocument(this.postData).then(res => {
        console.log(res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },

    // beforeUpload(file) {
    //   const isLt1M = file.size / 1024 / 1024 < 1

    //   if (isLt1M) {
    //     return true
    //   }

    //   this.$message({
    //     message: 'Please do not upload files larger than 1m in size.',
    //     type: 'warning'
    //   })
    //   return false
    // },

    // handleSuccess({ results, header }) {
    //   this.tableData = results
    //   this.tableHeader = header
    // }
  }
}
</script>
<style type="text/css">
.fw600 {
  font-weight: 600;
}
.upload-line {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #EFEFEF;
  overflow: hidden;
}
.el-upload {
  display: block;
  height: 100%;
}
.upload-line-left {
  width: 48%;
}
.avatar-uploader {
  width: 50%;
  height: auto;
  background-color: #EFEFEF;
  position: relative;

}
.avatar-uploader  img {
  width: 100%;
  object-fit: cover;
}
.avatar-remove {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 30px;
}
.avatar-cute {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,.6);
  color: #FFF;
  line-height: 30px;
}
.btn-save {
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #EFEFEF;
}

/* Ensure the size of the image fit the container perfectly */
#image{
  width: 100%;
  height: auto;
  margin: 0 auto;
  z-index: 2
}
.image-slot {
  width: 100px;
  height: 100px;
}
.el-select {
  display: block;
}
.el-select-dropdown {
    max-width: 100%;
}
.el-checkbox {
  z-index: 0
}
.el-loading-spinner i {
  font-size: 50px;
}
</style>
