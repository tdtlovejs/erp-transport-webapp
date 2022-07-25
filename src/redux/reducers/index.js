import { combineReducers } from 'redux';
import auth from './auth';
const rootReducer = combineReducers({
  authReducer: auth,
    //Thêm reducer tạo mới vào rootReducer ở đây
});

export default rootReducer;
