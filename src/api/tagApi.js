import {methodGet, methodPost, methodDelete} from "./index";

export default {
  getTree(param) {
    return new methodGet("/tag/getTree", {themeId: param})
  },
  getSimpleList(param) {
    return new methodGet('/tag/getSimpleList', {themeId: param})
  },
  addTag(param) {
    return new methodPost('/tag/add', param)
  },
  renameTag(param) {
    return new methodPost('/tag/rename', param)
  },
  removeTag(param) {
    return new methodPost('/tag/remove', param)
  },
  deleteTag(param) {
    return new methodDelete('/tag/delete', {tagId: param})
  },
  changePosition(param) {
    return new methodPost('/tag/changePosition', param)
  },
  changeOrder(param) {
    return new methodPost('/tag/changeOrder', param)
  },
  reparentTag(param) {
    return new methodPost('/tag/reparent', param)
  },
  recoverTag(param) {
    return new methodGet('/tag/recover', {tagId: param})
  }
}