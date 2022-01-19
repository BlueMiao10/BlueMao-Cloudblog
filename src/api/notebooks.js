import request from "../helper/request";
import {friendlyDate} from "../helper/util";

const URL = {
  GET: '/notebooks',
  ADD: '/notebooks',
  UPDATE: '/notebooks/:id',
  DELETE: '/notebooks/:id'
}

export default {
  getAll: function () {
    return new Promise((resolve, reject) => {
      request(URL.GET)
        .then(res => {
          res.data = res.data.sort((notebook1, notebook2) => notebook1.createdAt < notebook2.createdAt ? 1 : -1)
          res.data.map(notebook => {
            notebook.freiendlyCreatedAt = friendlyDate(notebook.createdAt)
          })
          resolve(res)
        }).catch(err => reject(err))
    })
  },
  //不传递参数就是后边的，传递参数但为空就取前边的 值。如果传递参数不为空就取传入的参数
  updateNotebook(notebookId, {title = ''} = {title: ''}) {
    return request(URL.UPDATE.replace(':id', notebookId), 'PATCH', {title})
  },
  deleteNotebook(notebookId) {
    return request(URL.DELETE.replace(':id', notebookId), 'DELETE')
  },
  addNotebook({title = ''} = {title: ''}) {
    return request(URL.ADD, 'POST', {title})
  }
}
