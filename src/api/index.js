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

// 根据歌曲ID查询歌曲对象
export const songOfSongId = (params) => post(`song/detail`, params)

// 根据歌曲名查询歌曲对象
export const songOfSongName = (params) => post(`song/songOfSongName`, params) // songName

// ------------------------------------歌单相关---------------------------------------
// 查询歌单
export const getAllSongList = (params) => post(`songList/allSongList`, params)
// 添加歌单
export const setSongList = (params) => post(`songList/add`, params)

// 编辑歌单
export const updateSongList = (params) => post(`songList/update`, params)

// 删除歌单
export const delSongList = (params) => post(`songList/delete`, params)

// ------------------------------------歌单歌曲相关---------------------------------------
/*
// 根据歌单ID查询
export const listSongDetail = (params) => post(`listSong/detail`, params)// 500
// 给歌单增加歌曲
export const listSongAdd = (params) => post(`listSong/add`, params) // 500
// 删除歌曲
export const delListSong = (params) => post(`listSong/delete`, params)
 */

// 根据歌单id查询歌曲列表
export const listSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`)
// 给歌单增加歌曲
export const listSongAdd = (params) => post(`listSong/add`, params)
// 删除歌单的歌曲
export const delListSong = (songId, songListId) => get(`listSong/delete?songId=${songId}&songListId=${songListId}`)

// ------------------------------------用户相关---------------------------------------
// 查询用户
export const getAllConsumer = () => get(`consumer/allConsumer`)
// 添加用户
export const setConsumer = (params) => post(`consumer/add`, params)

// 编辑用户
export const updateConsumer = (params) => post(`consumer/update`, params)

// 删除用户
export const delConsumer = (id) => get(`consumer/delete?${id}`)
