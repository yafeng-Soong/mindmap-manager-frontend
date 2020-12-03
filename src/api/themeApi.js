import {methodGet, methodPost, methodPut} from "./index";

export default {
  getList(){
    return new methodGet("/theme/getList")
  },
  getPageList(param) {
    return new methodPost("/theme/getPageList", param)
  },
  addTag(param) {
    return new methodPut('/theme/add', param)
  }
}
