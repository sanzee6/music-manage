import {get, post} from './http'

// 判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`, params)

// ------------------------------------歌手相关---------------------------------------
// 查询歌手
export const getAllSinger = (params) => post(`singer/allSinger`, params)
// 添加歌手
export const setSinger = (params) => post(`singer/add`, params)

// 编辑歌手
export const updateSinger = (params) => post(`singer/update`, params)

// 删除歌手
export const delSinger = (params) => post(`singer/delete`, params)

// ------------------------------------歌曲相关---------------------------------------

export const songOfSingerId = (params) => post(`song//singer/detail`, params)
