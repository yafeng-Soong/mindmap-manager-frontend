import {methodGet,methodPost} from "./index";

export default {
  getTree(param) {
    return new methodGet("/tag/getTree", {themeId: param})
  },
  getSimpleList(param) {
    return new methodGet('/tag/getSimpleList', {themeId: param})
  },
  getRemoveList(param) {
    return new methodGet("/tag/getRemovedList", {themeId: param})
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
  changePosition(param) {
    return new methodPost('/tag/changePosition', param)
  },
  changeOrder(param) {
    return new methodPost('/tag/changeOrder', param)
  },
  reparentTag(param) {
    return new methodPost('/tag/reparent', param)
  }
}