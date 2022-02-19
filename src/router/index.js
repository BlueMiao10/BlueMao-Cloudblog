import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Notebooks from "../components/NotebookList";
import Note from "../components/NoteDetail";
import Trash from "../components/TrashDetail";

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/notebooks',
      component:Notebooks
    },
    {
      path:'/note',
      component:Note
    },
    {
      path:'/trash',
      component:Trash

    }
  ]
})
