<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate"><i class="iconfont icon-plus"></i>新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="book-list">
          <router-link to="/note/1" class="notebook" v-for="notebook in notebooks">
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
import Notebooks from '../api/notebooks'
import {friendlyDate} from "../helper/util";

export default {
  name: 'NotebookList',
  data() {
    return {
      notebooks: []
    }
  },
  methods: {
    onCreate() {
      let title = window.prompt('请输入笔记本名')
      if (title.trim() === '') {
        alert('笔记本名不能为空')
        return
      }
      Notebooks.addNotebook({title})
        .then(res => {
          res.data.freiendlyCreatedAt = friendlyDate(res.data.createdAt)
          this.notebooks.unshift(res.data)
        })
    },
    onEdit(notebook) {
      let title = window.prompt('修改标题', notebook.title)
      Notebooks.updateNotebook(notebook.id, {title})
        .then(() => {
          notebook.title = title
        })
    },
    onDelete(notebook) {
      let isConfirm = window.confirm('确定删除？')
      if (isConfirm) {
        Notebooks.deleteNotebook(notebook.id)
          .then(() => {
            this.notebooks.splice(this.notebooks.indexOf(notebook), 1)
          })
      }
    }
  },
  created() {
    Auth.getInfo()
      .then(({isLogin}) => {
        if (!isLogin) this.$router.push({path: '/login'})
      })
    Notebooks.getAll()
      .then(res => {
        this.notebooks = res.data
      })
  }
}
</script>

<style scoped lang="less">
#notebook-list {
  flex: 1;

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
