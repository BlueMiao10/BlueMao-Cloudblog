<template>
  <div class="detail" id="note">
    <note-sidebar @update:notes="val => this.notes = val"/>
    <ol class="note-detail">
      <li class="note-empty" v-show="!curNote.id">
        请选择笔记
      </li>
      <li class="note-detail-ct" v-show="curNote.id">
        <ol class="note-detail-ct">
          <li class="note-bar">
            <span>创建日期：{{ curNote.createdAtFriendly }}</span>
            <span>更新日期：{{ curNote.updatedAtFriendly }}</span>
            <span>{{ statusText }}</span>
            <span class="iconfont icon-delete" @click="onDeleteNote"></span>
            <span class="iconfont icon-fullscreen" @click="isShowPreview = !isShowPreview"></span>
          </li>
          <li class="note-title">
            <input type="text" v-model:value="curNote.title" @input="onUpdateNote" @keydown="statusText='正在输入...'"
                   placeholder="请输入标题">
          </li>
          <li class="editor">
            <codemirror v-model="curNote.content" :options="cmOptions" v-show="!isShowPreview" @input="onUpdateNote"
                        @inputRead="statusText='正在输入...'"></codemirror>
            <div class="preview markdown-body" v-html="previewContent" v-show="isShowPreview"></div>
          </li>
        </ol>
      </li>
    </ol>
  </div>
</template>

<script>
import NoteSidebar from './NoteSidebar'
import _ from 'lodash'
import MarkdownIt from 'markdown-it'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Auth from "../api/auth";
import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/neat.css'

let md = new MarkdownIt()
export default {
  components: {
    NoteSidebar, codemirror
  },
  data() {
    return {
      statusText: '笔记未改动',
      isShowPreview: false,
      cmOptions: {
        tabSize: 4,
        mode: 'text/x-markdown',
        theme: 'neat',
        lineNumbers: false,
        line: true,
      }
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
      if(!this.curNote.id) return
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
    ]),

    previewContent() {
      return md.render(this.curNote.content || '')
    }
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
}

.note-detail {
  flex: 1;
  display: flex;
  flex-direction: column;

  .note-detail-ct {
    height: 100%;
  }

  .note-empty {
    font-size: 50px;
    color: #ccc;
    text-align: center;
    margin-top: 100px;
  }

  .note-detail-ct {
    height: 100%;
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

    input {
      border-bottom: 1px solid #efebeb;
    }
  }

  .editor {
    height: ~"calc(100% - 70px)";
    position: relative;
  }

  .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  code {
    color: #f66;
  }
}
</style>
