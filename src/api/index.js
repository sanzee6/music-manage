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
// 根据歌手id查询歌曲
export const songOfSingerId = (params) => post(`song/singer/detail`, params)

// 编辑歌曲
export const updateSong = (params) => post(`song/update`, params)
// 删除歌曲
export const delSong = (params) => post(`song/delete`, params)

// ------------------------------------歌单相关---------------------------------------
// 查询歌单
export const getAllSongList = (params) => post(`songList/allSongList`, params)
// 添加歌单
export const setSongList = (params) => post(`songList/add`, params)

// 编辑歌单
export const updateSongList = (params) => post(`songList/update`, params)

// 删除歌单
export const delSongList = (params) => post(`songList/delete`, params)
