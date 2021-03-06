<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate"><i class="iconfont icon-plus"></i>新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="book-list">
          <router-link :to="`/note?notebookId=${notebook.id}`" class="notebook" v-for="notebook in notebooks"
                       :key="notebook.id">
            <div>
              <span class="iconfont icon-notebook"></span>{{ notebook.title }}
              <span>{{ notebook.noteCounts }}</span>
              <span class="action" @click.stop.prevent="onEdit(notebook)">编辑</span>
              <span class="action" @click.stop.prevent="onDelete(notebook)">删除</span>
              <span class="date">{{ notebook.freiendlyCreatedAt }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Auth from '../api/auth'
import {mapActions, mapGetters} from 'vuex'

export default {
  data() {
    return {}
  },
  created() {
    Auth.getInfo()
      .then(({isLogin}) => {
        if (!isLogin) {
          this.$message.error('登录后才能操作')
          this.$router.push({path: '/login'})
        }
      })
    this.$store.dispatch('getNotebooks')
  },
  computed: {
    ...mapGetters(['notebooks'])
  },
  methods: {
    ...mapActions([
      'getNotebooks',
      'addNotebook',
      'updateNotebook',
      'deleteNotebook',
    ]),
    onCreate() {
      this.$prompt('请输入笔记本名称', '创建笔记本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '名称不能为空，且不能超过30个字符'
      }).then(({value}) => {
        this.addNotebook({title: value})
      }).catch((res) => this.$message.info({message: res.msg || '取消添加'}));
    },
    onEdit(notebook) {
      this.$prompt('请输入新笔记本名称', '编辑笔记本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputValue: notebook.title,
        inputErrorMessage: '名称不能为空，且不能超过30个字符'
      }).then(({value}) => this.updateNotebook({notebookId: notebook.id, title: value}))
        .catch((res) => this.$message.info({message: res.msg || '取消修改'}))
    },
    onDelete(notebook) {
      this.$confirm('删除笔记本, 是否继续?', '删除笔记本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => this.deleteNotebook({notebookId: notebook.id}))
        .catch((res) => this.$message.info({message: res.msg || '取消删除'}))
    }
  }
}
</script>

<style scoped lang="less">
#notebook-list {
  flex: 1;
  overflow: auto;
  .btn {
    font-size: 12px;
    color: #666;
    cursor: pointer;
    margin-left: 10px;
  }

  .btn .iconfont {
    font-size: 12px;
  }

  input {
    width: 300px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 5px;
    outline: none;
  }

  header {
    padding: 12px;
    border-bottom: 1px solid #ccc;
  }

  main {
    padding: 30px 40px;
  }

  .layout {
    max-width: 966px;
    margin: 0 auto;
  }


  main h3 {
    font-size: 12px;
    color: #000;
  }

  main .book-list {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
    background-color: #fff;
    border-radius: 4px;
    font-weight: bold;
  }

  main .book-list span {
    font-size: 12px;
    font-weight: bold;
    color: #b3c0c8;
  }

  main .date,
  main .action {
    float: right;
    margin-left: 10px;
  }

  main .iconfont {
    color: #1687ea;
    margin-right: 4px;
  }

  main .notebook {
    display: block;
    cursor: pointer;
  }

  main a.notebook:hover {
    background-color: #f7fafd;
  }

  main a.notebook div {
    border-bottom: 1px solid #ebebeb;
    padding: 12px 14px;
  }

  main .error-msg {
    font-size: 12px;
    color: red;
  }
}
</style>
