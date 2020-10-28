<template>
  <!-- $t is vue-i18n global function to translate lang -->

  <div v-if="isMobile" class="app-container">
    <el-button type="primary" @click="handleAddDocument">
      {{ $t('excel.add') }}
    </el-button>
    <el-table v-loading="listLoading" style="width: 100%;margin-top:30px;" :data="list" element-loading-text="Loading..." border fit highlight-current-row>
      <el-table-column :label="$t('excel.tabNo')">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEditDocument(scope.row)">{{ $t('excel.edit') }}</el-button>
          <el-popconfirm
            confirmButtonText='确定'
            cancelButtonText='取消'
            @onConfirm="handleDelDocument(scope.row)"
            icon="el-icon-info"
            iconColor="red"
            title="确定删除吗？"
          >
            <el-button slot="reference" type="text" style="color: #f56c6c; margin-left: 15px" >{{ $t('excel.del') }}</el-button>
          </el-popconfirm>
        </template>

      </el-table-column>
    </el-table>
  </div>

  <!-- PC端 -->
  <div v-else class="app-container">
    <el-button type="primary" @click="handleAddDocument">
      {{ $t('excel.add') }}
    </el-button>
    <el-table v-loading="listLoading" style="margin-top:30px;" :data="list" element-loading-text="Loading..." border fit highlight-current-row>
<!--       <el-table-column align="center" :label="$t('excel.tabNo')" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('excel.tabTitle')">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
<!--       <el-table-column  :label="$t('excel.tabUser')"  width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.openid }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column  :label="$t('excel.tabUser')"  width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <!--       <el-table-column label="Readings" width="115" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" :label="$t('excel.tabDate')" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('excel.tabFunc')" >
        <template slot-scope="scope">
  <!--         <el-link target="_self" :href="scope.row.id | filterUrl" :underline="false" style="margin-right:15px">下载 -->
            <el-button type="primary" @click="downLoad(scope.row)">
            {{ $t('excel.exportWord') }}
            </el-button>
<!--             <el-button type="primary" @click="downLoad(scope.row)">
            {{ $t('excel.exportPdf') }}
            </el-button> -->
          <!-- </el-link> -->
          <el-button type="text" @click="handleEditDocument(scope.row)">{{ $t('excel.edit') }}</el-button>
          <el-button @click="handleDelDocument(scope.row)" type="text" style="color: #f56c6c; margin-left: 15px" >{{ $t('excel.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--     <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-position="left">
        <el-form-item label="id">
          <el-input v-model="role.title" placeholder="id" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog> -->
  </div>

</template>

<script>
import { fetchList, editDocument, downLoadDocument, delDocument } from '@/api/article'
import { parseTime } from '@/utils'
// options components
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'

import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'
import ImageModule from 'docxtemplater-image-module-free'
import doc from './document.js'

const defaultRole = {
  title: ''
}

export default {
  name: 'ExportExcel',
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      loading: null,
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      dialogVisible: true,
      dialogType: '',
      role: {},
      publicPath: process.env.BASE_URL,
      testUrl: ''
    }
  },
  computed: {
    // 添加判断方法
    isMobile() {
      const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      fetchList({
        openid: this.$store.getters.token
      }).then(response => {
        console.log()
        let userId = this.$store.getters.token
        response = response.filter(item => {
          if (userId == 'admin') {
            return item.status !== '已删除'
          } else {
            return item.status !== '已删除' && item.openid == userId
          }
        })
        this.list = response
        this.listLoading = false
      })
    },
    downLoad(data) {
      this.loading = this.$loading({
        lock: true,
        text: 'Export Document···',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
      downLoadDocument(data).then(res => {
        console.log(res)
        this.loading.close()
        if (document.domain == 'localhost') {
          // 本地地址
          window.location.href = 'http://maio3o.com/doc/' + res
        } else {
          window.location.href = 'http://api.tncsoeasy.com/doc/' + res
        }
      }).catch(e => {
        this.loading.close()
      })
    },
    handleAddDocument() {
      const data = {
        title: `T&C Report`,
        openid: this.$store.getters.token,
        cont: doc,
        name: '',
        timestamp: new Date().getTime(),
        createtime: new Date().getTime(),
      }

      editDocument(data).then(res => {
        console.log(res)
        this.fetchData()
      })
      
    },
    handleEditDocument(row) {
      console.log(row)
      this.$router.push({ path: `/reports/${row.id}` })
    },
    handleDelDocument(row) {
      row.status = '已删除'
      delDocument(row).then(res => {
        console.log(res)
      })
      // this.fetchData()
      this.list = this.list.filter(item => item.id !== row.id)
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
    //     const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
    //     const list = this.list
    //     const data = this.formatJson(filterVal, list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: this.filename,
    //       autoWidth: this.autoWidth,
    //       bookType: this.bookType
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
.el-loading-spinner i {
  font-size: 50px;
}
</style>
