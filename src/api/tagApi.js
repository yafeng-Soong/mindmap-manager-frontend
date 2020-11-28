import {methodGet,methodPost} from "./index";

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
  }
}