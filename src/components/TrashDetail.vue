<template>
  <div id="trash" class="detail">
    <div class="note-sidebar">
      <h3 class="notebook-title">回收站</h3>
      <div class="menu">
        <div>更新时间</div>
        <div>标题</div>
      </div>
      <ul class="notes">
        <li v-for="note in trashNotes">
          <router-link :to="`/trash?noteId=${note.id}`">
            <span class="date">{{ note.updatedAtFriendly }}</span>
            <span class="title">{{ note.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="note-detail">
      <div class="note-bar" v-if="true">
        <span> 创建日期: {{ curTrashNote.createdAtFriendly }}</span>
        <span> | </span>
        <span> 更新日期: {{ curTrashNote.updatedAtFriendly }}</span>
        <span> | </span>
        <span> 所属笔记本: {{ belongTo }}</span>

        <a class="btn action" @click="onRevert">恢复</a>
        <a class="btn action" @click="onDelete">彻底删除</a>
      </div>
      <div class="note-title">
        <span>{{ curTrashNote.title }}</span>
      </div>
      <div class="editor">
        <div class="preview markdown-body" v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script>

import MarkdownIt from 'markdown-it'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import NoteSidebar from "./NoteSidebar";
import Auth from "../api/auth";

let md = new MarkdownIt()

export default {
  data() {
    return {}
  },
  components: {
    NoteSidebar
  },

  created() {
    Auth.getInfo()
      .then(({isLogin}) => {
        if (!isLogin) {
          this.$message.error('登录后才能操作')
          this.$router.push({path: '/login'})
        }
      })
    this.getNotebooks()
    this.getTrashNotes()
      .then(() => {
        this.setCurTrashNote({curTrashNoteId: this.$route.query.noteId})
        if (!this.curNote) return
        this.$router.replace({
          path: '/note',
          query: {
            noteId: this.curNote.id,
            notebookId: this.curBook.id
          }
        })
      })
  },

  computed: {
    ...mapGetters([
      'trashNotes',
      'curTrashNote',
      'belongTo'
    ]),

    compiledMarkdown() {
      return md.render(this.curTrashNote.content || '')
    }
  },

  methods: {
    ...mapMutations([
      'setCurTrashNote'
    ]),

    ...mapActions([
      'checkLogin',
      'deleteTrashNote',
      'revertTrashNote',
      'getTrashNotes',
      'getNotebooks'
    ]),

    onDelete() {
      this.$confirm('删除笔记本, 是否继续?', '删除笔记本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => this.deleteTrashNote({noteId: this.curTrashNote.id}))
        .catch((res) => this.$message.info({message: res.msg || '取消删除'}))
    },

    onRevert() {
      this.setCurTrashNote()
      this.$router.replace({
        path: '/note',
        query: {
          noteId: this.curTrashNote.id
        }
      })
      this.revertTrashNote({noteId: this.curTrashNote.id})
    }
  },

  beforeRouteUpdate(to, from, next) {
    this.setCurTrashNote({curTrashNoteId: to.query.noteId})
    next()
  }

}
</script>

<style lang="less">
#trash {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
  overflow: hidden;
  .note-sidebar{
    overflow: auto;
  }
  .note-bar {
    .action {
      float: right;
      margin-left: 10px;
      padding: 2px 4px;
      font-size: 12px;
    }
  }
}

.note-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .note-detail-ct {
    height: 100%;
  }

  .note-empty {
    font-size: 50px;
    color: #ccc;
    text-align: center;
    margin-top: 100px;
  }

  .note-bar {
    padding: 4px 20px;
    border-bottom: 1px solid #eee;

    &:after {
      content: "";
      display: block;
      clear: both;
    }

    span {
      font-size: 12px;
      color: #999;
      margin-right: 4px;
    }

    .iconfont {
      float: right;
      margin-left: 4px;
      font-size: 18px;
      cursor: pointer;
    }

  }

  .note-title {
    input, span {
      display: inline-block;
      width: 100%;
      border: none;
      outline: none;
      font-size: 18px;
      padding: 10px 20px;
    }
  }

  .editor {
    height: ~"calc(100% - 70px)";
    position: relative;
  }

  textarea, .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  textarea {
    border: none;
    resize: none;
    outline: none;
    font-size: 14px;
    font-family: "Monaco", courier, monospace;
  }

  code {
    color: #f66;
  }
}

.note-sidebar {
  position: relative;
  width: 290px;
  border-right: 1px solid #ccc;
  background-color: #eee;

  .add-note {
    position: absolute;
    right: 5px;
    top: 12px;
    color: #666;
    font-size: 12px;
    padding: 2px 4px;
    box-shadow: 0 0 2px 0 #ccc;
    border: none;
    z-index: 1;
  }

  .notebook-title {
    font-size: 18px;
    font-weight: normal;
    color: #333;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    background-color: #f7f7f7;
    display: block;
  }

  .el-dropdown-link {
    cursor: pointer;
  }

  .el-dropdown-menu__item {
    width: 200px;
  }

  .menu {
    display: flex;

    div {
      font-size: 12px;
      padding: 2px 10px;
      flex: 1;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;

      &:last-child {
        border-right: none;
      }
    }

    .iconfont {
      font-size: 10px;
    }
  }

  .notes {
    li {
      &:nth-child(odd) {
        background-color: #f2f2f2;
      }

      a {
        display: flex;
        padding: 3px 0;
        font-size: 12px;
        border: 2px solid transparent;
      }

      .router-link-exact-active {
        border: 2px solid #81c0f3;
        border-radius: 3px;
      }

      span {
        display: inline-block;
        padding: 0 10px;
        flex: 1;
      }

      .title {
        max-width: 200px;
      }
    }
  }
}
</style>
