import {methodGet, methodPost, methodPut, methodDelete} from "./index";

export default {
  getList(){
    return new methodGet("/theme/getList")
  },
  getOtherList(param) {
    return new methodGet('/theme/getList', {selfId: param})
  },
  getPageList(param) {
    return new methodPost("/theme/getPageList", param)
  },
  addTheme(param) {
    return new methodPut('/theme/add', param)
  },
  addByXmind(param) {
    return new methodPost('/theme/importXmindFile', param)
  },
  updateTheme(param) {
    return new methodPost('/theme/update', param)
  },
  removeTheme(param) {
    return new methodDelete('/theme/remove', {themeId: param})
  },
  recoverTheme(param) {
    return new methodGet('/theme/recover', {themeId: param})
  },
  combineToTheme(param) {
    return new methodPost('/theme/combine', param)
  },
  deleteTheme(param) {
    return new methodDelete('/theme/delete', {themeId: param})
  },
  getRecentOperations(param) {
    return new methodPost('/theme/getOperations', param)
  },
  getRemoveList(param) {
    return new methodPost("/theme/getRemovedTagList", param)
  },
}
