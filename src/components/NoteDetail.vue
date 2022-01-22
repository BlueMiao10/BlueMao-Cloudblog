<template>
  <div class="detail" id="note">
    <note-sidebar @update:notes="val => notes = val"/>
    <ol class="note-detail">
      <li class="note-empty" v-show="!curNote.id">
        请选择笔记
      </li>
      <li  class="note-detail-ct" v-show="curNote.id">
        <ol  class="note-detail-ct">
          <li class="note-bar">
            <span>创建日期：{{ curNote.createdAtFriendly }}</span>
            <span>更新日期：{{ curNote.updatedAtFriendly }}</span>
            <span>{{ statusText }}</span>
            <span class="iconfont icon-delete" @click="deleteNote"></span>
            <span class="iconfont icon-fullscreen" @click="isShowPreview = !isShowPreview"></span>
          </li>
          <li class="note-title">
            <input type="text" v-model:value="curNote.title" @input="updateNote" @keydown="statusText='正在输入...'"
                   placeholder="请输入标题">
          </li>
          <li class="editor">
            <textarea v-show="!isShowPreview" v-model:value="curNote.content" @keydown="statusText='正在输入...'" @input="updateNote"
                      placeholder="输入内容，支持markdown语法"></textarea>
            <div class="preview markdown-body" v-html="previewContent" v-show="isShowPreview"></div>
          </li>
        </ol>
      </li>
    </ol>
  </div>
</template>

<script>
import Auth from '../api/auth'
import NoteSidebar from './NoteSidebar'
import Bus from '../helper/bus'
import _ from 'lodash'
import Notes from '../api/note'
import MarkdownIt from 'markdown-it'

let md = new MarkdownIt()
export default {
  name: 'NoteDetail',
  components: {
    NoteSidebar
  },
  data() {
    return {
      curNote: {},
      notes: [],
      statusText: '笔记未改动',
      isShowPreview:false
    }
  },
  methods: {
    updateNote: _.debounce(function () {
      Notes.updateNote({noteId: this.curNote.id}, {title: this.curNote.title, content: this.curNote.content})
        .then(() => {
          this.statusText = '已保存'
        }).catch(res => {
        this.$message.info(this.statusText = res.msg || '保存出错')
      })
    }, 300),
    deleteNote() {
      Notes.deleteNote({noteId: this.curNote.id})
        .then(data => {
          this.$message.success(data.msg || '删除成功')
          this.notes.splice(this.notes.indexOf(this.curNote),1)
          this.$router.replace({path:'/note'})
        })
    }
  },
  computed:{
    previewContent(){
      return md.render(this.curNote.content || '')
    }
  },
  created() {
    Auth.getInfo()
      .then(res => {
        if (!res.isLogin) {
          this.$router.push({path: '/login'})
        }
      })
    Bus.$once('update:notes', val => {
      this.curNote = val.find(note => note.id == this.$route.query.noteId) || {}
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.curNote = this.notes.find(note => note.id == to.query.noteId) || {}
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
  .note-detail-ct{
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
</style>
