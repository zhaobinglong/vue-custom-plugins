<template>
  <div>
    <el-card class="box-card" style="margin-top:40px;">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="user" />
        <span style="margin-left:10px;">{{ $t('login.user') }}</span>
      </div>
      <div>
        <el-button type="danger" @click="logout">{{ $t('login.logout') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'I18n',
  data() {
    return {
      date: '',
      tableData: [],
      options: [],
      value: ''
    }
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.app.language
      }
    }
  },
  watch: {},
  created() {
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 600px;
  max-width: 100%;
  margin: 20px auto;
}
.item-btn{
  margin-bottom: 15px;
  margin-left: 0px;
}
.block {
  padding: 25px;
}
</style>
