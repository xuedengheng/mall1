/**
 * Created by Ben on 2017/3/24.
 */
const sessionStorage = window.sessionStorage

export const SessionUtil = {
    /**
     * 设置存储
     * @param key {string} 键值
     * @data data {object} 数据
     */
    set(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data))
    },

    /**
     * 获取存储
     * @param key {string} 键值
     */
    get(key) {
        return JSON.parse(sessionStorage.getItem(key)) || undefined
    },

    /**
     * 移除存储
     * @param key {string} 键值
     */
    remove(key) {
        sessionStorage.removeItem(key)
    },

    /**
     * 清空存储
     */
    clear() {
        sessionStorage.clear()
    }
}