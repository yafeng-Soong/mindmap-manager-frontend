import {methodGet, methodPost, methodDelete} from "./index";

export default {
  getList(param) {
    return new methodGet("/paper/getList", {tagId:param})
  },
  submit(param) {
    return new methodPost("/paper/submit", param)
  },
  uploadFile(param) {
    return new methodPost("/paper/uploadFile", param)
  },
  updateFile(param) {
    return new methodPost('/paper/updateFile', param)
  },
  getPageList(param) {
    return new methodPost('/paper/getPageList', param)
  },
  getPageListByTag(param) {
    return new methodPost('/paper/getListByTagId', param)
  },
  deletePaper(param) {
    return new methodDelete('/paper/deletePaper', {paperId: param})
  },
  deletePaperFromTag(param) {
    return new methodPost('/paper/deleteFromTag', param)
  }
}