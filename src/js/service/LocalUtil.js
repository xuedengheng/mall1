/**
 * Created by Ben on 2017/2/24.
 */
const localStorage = window.localStorage

export const LocalUtil = {
    /**
     * 设置存储
     * @param key {string} 键值
     * @data data {object} 数据
     */
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data))
    },

    /**
     * 获取存储
     * @param key {string} 键值
     */
    get(key) {
        return JSON.parse(localStorage.getItem(key)) || undefined
    },

    /**
     * 移除存储
     * @param key {string} 键值
     */
    remove(key) {
        localStorage.removeItem(key)
    },

    /**
     * 清空存储
     */
    clear() {
        localStorage.clear()
    }
}