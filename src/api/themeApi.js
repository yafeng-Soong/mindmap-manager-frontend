import {methodGet} from "./index";

export default {
  getList(){
    return new methodGet("/theme/getList")
  }
}
