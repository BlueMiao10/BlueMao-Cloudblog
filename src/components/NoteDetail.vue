<template>
  <div class="detail" id="note">
    <note-sidebar @update:notes="val => this.notes = val"/>
    <div class="note-detail">
      <div class="note-empty" v-show="!curBook.id">请创建笔记本后</div>
      <div class="note-empty" v-show="!curNote.id">选择或创建笔记</div>
      <div class="note-detail-ct" v-show="curNote.id">
        <div class="note-bar">
          <span>创建日期：{{ curNote.createdAtFreiendly }}</span>
          <span>更新日期：{{ curNote.updatedAtFriendly }}</span>
          <span>{{ statusText }}</span>
          <span class="iconfont icon-delete" @click="onDeleteNote"></span>
<!--          <span class="iconfont icon-fullscreen" @click="isShowPreview = !isShowPreview"></span>-->
        </div>
        <div class="note-title">
          <input type="text" v-model:value="curNote.title" @input="onUpdateNote" @keydown="statusText='正在输入...'"
                 placeholder="请输入标题">
        </div>
        <div class="editor">
          <div class="markdown" >
            <Markdown v-model="curNote.content"  v-show="!isShowPreview" @input="onUpdateNote"
                      @inputRead="statusText='正在输入...'" :height="760" />
          </div>
          <!--          <codemirror v-model="curNote.content" :options="cmOptions" v-show="!isShowPreview" @input="onUpdateNote"-->
          <!--                      @inputRead="statusText='正在输入...'"></codemirror>-->
          <!--          <div class="preview markdown-body" v-html="previewContent" v-show="isShowPreview"></div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteSidebar from './NoteSidebar'
import _ from 'lodash'
import MarkdownIt from 'markdown-it'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Auth from "../api/auth";
import Markdown from 'vue-meditor'
// import {codemirror} from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/mode/markdown/markdown.js'
// import 'codemirror/theme/neat.css'

//let md = new MarkdownIt()
export default {
  components: {
    NoteSidebar, Markdown
  },
  data() {
    return {
      statusText: '笔记未改动',
      isShowPreview: false,
      // cmOptions: {
      //   tabSize: 4,
      //   mode: 'text/x-markdown',
      //   theme: 'neat',
      //   lineNumbers: false,
      //   line: true
      // }
    }
  },
  methods: {
    ...mapMutations([
      'setCurNote'
    ]),

    ...mapActions([
      'updateNote',
      'deleteNote',
    ]),
    onUpdateNote: _.debounce(function () {
      if (!this.curNote.id) return
      this.updateNote({noteId: this.curNote.id, title: this.curNote.title, content: this.curNote.content})
        .then(() => {
          this.statusText = '已保存'
        }).catch(res => {
        this.$message.info(this.statusText = res.msg || '保存出错')
      })
    }, 300),
    onDeleteNote() {
      this.deleteNote({noteId: this.curNote.id})
        .then(() => {
          this.$message.success('删除成功')
          this.$router.replace({path: '/note'})
        })
    }
  },
  computed: {
    ...mapGetters([
      'notes',
      'curNote',
      'curBook'
    ]),

    // previewContent() {
    //   return md.render(this.curNote.content || '')
    // }
  },
  created() {
    Auth.getInfo()
      .then(({isLogin}) => {
        if (!isLogin) {
          this.$message.error('登录后才能操作')
          this.$router.push({path: '/login'})
        }
      })
  },
  beforeRouteUpdate(to, from, next) {
    this.setCurNote({curNoteId: to.query.noteId})
    next()
  }
}
</script>

<style scoped lang="less">
#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
  overflow: hidden;

  .note-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

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
      overflow: auto;

      //.vue-codemirror {
      //  height: ~"calc(100% - 25px)";
      //  padding-left: 20px;
      //
      //  .CodeMirror.cm-s-neat {
      //    height: 100%;
      //    padding: 10px 10px 10px 20px;
      //  }
      //}
    }

    //textarea, .preview {
    //  position: absolute;
    //  width: 100%;
    //  height: 100%;
    //  padding: 20px;
    //}
    //
    //textarea {
    //  border: none;
    //  resize: none;
    //  outline: none;
    //  font-size: 14px;
    //  font-family: "Monaco", courier, monospace;
    //}
  }
}

#inquiry-details {
  display: block;
}
</style>
