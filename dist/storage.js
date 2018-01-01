!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.TuaStorage={})}(this,function(e){"use strict";var t=function(e){return function(){for(var t=[],r=arguments.length;r--;)t[r]=arguments[r];return!e.apply(void 0,t)}},r=function(e){return void 0===e&&(e={}),Object.keys(e).map(function(t){return t+"="+encodeURIComponent(e[t])}).join("&")},n="TUA_STORAGE_PREFIX: ",o="请输入参数 key!",i=function(e){void 0===e&&(e={});var t=e.syncFnMap;void 0===t&&(t={});var r=e.whiteList;void 0===r&&(r=[]);var o=e.storageEngine;void 0===o&&(o=null);var i=e.defaultExpires;void 0===i&&(i=30);var a=e.storageKeyPrefix;void 0===a&&(a=n),this.whiteList=r,this.syncFnMap=t,this.storageEngine=o,this.defaultExpires=i,this.storageKeyPrefix=a,this.SEMap=this._getFormatedSE(),this._cache={},this.clear([this.storageKeyPrefix])};i.prototype.load=function(e){var t=this;return Array.isArray(e)?Promise.all(e.map(function(e){return t._loadOneItem(e)})):this._loadOneItem(e)},i.prototype.save=function(e){var t=this;return Array.isArray(e)?Promise.all(e.map(function(e){return t._saveOneItem(e)})):this._saveOneItem(e)},i.prototype.remove=function(e){var t=this;return Array.isArray(e)?Promise.all(e.map(function(e){return t._removeOneItem(e)})):this._removeOneItem(e)},i.prototype.clear=function(e){return void 0===e&&(e=[]),this._clearFromCache(e),this.SEMap?this.SEMap._clear(e):Promise.resolve()},i.prototype._saveOneItem=function(e){var t=e.key;void 0===t&&(t="");var n=e.data,i=e.expires;void 0===i&&(i=this.defaultExpires);var a=e.syncParams;void 0===a&&(a={});var s=e.isEnableCache;if(void 0===s&&(s=!0),""===t)return Promise.reject(o);var c=this.storageKeyPrefix+(0===Object.keys(a).length?t:t+"?"+r(a)),u={rawData:n,expires:parseInt(Date.now()/1e3)+i};return s&&(this._cache[c]=u),this._setItem(c,u)},i.prototype._loadOneItem=function(e){var t=e.key;void 0===t&&(t="");var n=e.syncFn;void 0===n&&(n=this.syncFnMap[t]);var i=e.expires;void 0===i&&(i=this.defaultExpires);var a=e.syncParams;void 0===a&&(a={});var s=e.isAutoSave;void 0===s&&(s=!0);var c=e.isEnableCache;if(void 0===c&&(c=!0),""===t)return Promise.reject(o);var u=this.storageKeyPrefix+(0===Object.keys(a).length?t:t+"?"+r(a));return this._findData({key:u,syncFn:n,expires:i,syncParams:a,isAutoSave:s,isEnableCache:c})},i.prototype._removeOneItem=function(e){return void 0===e&&(e=""),""===e?Promise.reject(o):(delete this._cache[this.storageKeyPrefix+e],this.SEMap?this.SEMap._removeItem(this.storageKeyPrefix+e):Promise.resolve())},i.prototype._getFormatedSE=function(){var e,r=this;if(!this.storageEngine)return console.warn("There is NO valid storageEngine specified!\n Please use localStorage(for web), wx(for miniprogram) or AsyncStorage(for React Native) as the storageEngine...\nOtherwise data would be saved in cache(Memory) and lost after reload..."),null;var n=function(t){return(e={})[t]={_clear:r["_clearBy"+t.toUpperCase()].bind(r),_setItem:r["_setItemBy"+t.toUpperCase()].bind(r),_getItem:r["_getItemBy"+t.toUpperCase()].bind(r),_removeItem:r["_removeItemBy"+t.toUpperCase()].bind(r)},e},o=Object.assign({},n("wx"),n("ls"),n("as")),i={wx:["getStorageInfo","removeStorageSync","setStorage","getStorage","removeStorage"],ls:["getItem","setItem","removeItem"],as:["getItem","setItem","multiRemove"]},a=function(e){return!!r.storageEngine[e]};if(i.wx.every(a))return o.wx;if(!i.ls.every(a)&&!i.as.every(a)&&!i.wx.every(a)){var s=i.ls.filter(t(a)),c=i.as.filter(t(a)),u=i.wx.filter(t(a));s.length&&console.warn("Missing localStorage's required apis: "+s.join(", ")+"!"),c.length&&console.warn("Missing AsyncStorage's required apis: "+c.join(", ")+"!"),u.length&&console.warn("Missing wx's required apis: "+u.join(", ")+"!"),console.warn("There is NO valid storageEngine specified!\n Please use localStorage(for web), wx(for miniprogram) or AsyncStorage(for React Native) as the storageEngine...\nOtherwise data would be saved in cache(Memory) and would be lost after reload...")}try{var g=this.storageEngine.setItem("test","test");this.storageEngine.removeItem("test");return!(!g||!g.then)?o.as:o.ls}catch(e){return this.storageEngine=null,null}},i.prototype._getFilteredKeys=function(e){var t=e.concat(this.whiteList);return function(e){return e.filter(function(e){return t.every(function(t){return!e.includes(t)})})}},i.prototype._clearFromCache=function(e){var t=this;this._getFilteredKeys(e)(Object.keys(this._cache)).forEach(function(e){delete t._cache[e]})},i.prototype._clearByWX=function(e){var t=this;return new Promise(function(r,n){return t.storageEngine.getStorageInfo({fail:n,success:function(n){var o=n.keys;return t._getFilteredKeys(e)(o).forEach(function(e){return t.storageEngine.removeStorageSync(e)}),r()}})})},i.prototype._clearByAS=function(e){var t=this;return this.storageEngine.getAllKeys().then(this._getFilteredKeys(e)).then(function(e){return t.storageEngine.multiRemove(e)}).catch(console.error)},i.prototype._clearByLS=function(e){for(var t=this,r=e.concat(this.whiteList),n=[],o=function(e,o){var i=t.storageEngine.key(e);r.every(function(e){return!i.includes(e)})&&n.push(i)},i=0,a=this.storageEngine.length;i<a;i++)o(i);return Promise.all(n.map(function(e){return t.storageEngine.removeItem(e)})).catch(console.error)},i.prototype._setItem=function(e,t){return this.SEMap?this.SEMap._setItem(e,t):Promise.resolve()},i.prototype._setItemByWX=function(e,t){var r=this;return new Promise(function(n,o){return r.storageEngine.setStorage({key:e,data:t,fail:o,success:n})})},i.prototype._setItemByAS=function(e,t){return this.storageEngine.setItem(e,t)},i.prototype._setItemByLS=function(e,t){return Promise.resolve(this.storageEngine.setItem(e,JSON.stringify(t)))},i.prototype._getItem=function(e){return this.SEMap?this.SEMap._getItem(e):Promise.resolve()},i.prototype._getItemByWX=function(e){var t=this;return new Promise(function(r,n){return t.storageEngine.getStorage({key:e,fail:n,success:function(e){var t=e.data;return r(t)}})})},i.prototype._getItemByAS=function(e){return this.storageEngine.getItem(e)},i.prototype._getItemByLS=function(e){return Promise.resolve(this.storageEngine.getItem(e))},i.prototype._removeItemByWX=function(e){var t=this;return new Promise(function(r,n){return t.storageEngine.removeStorage({key:e,fail:n,success:r})})},i.prototype._removeItemByAS=function(e){return this.storageEngine.removeItem(e)},i.prototype._removeItemByLS=function(e){return Promise.resolve(this.storageEngine.removeItem(e))},i.prototype._findData=function(e){var t=this,r=e.key,n=e.isEnableCache,o={};for(var i in e)-1===["key","isEnableCache"].indexOf(i)&&(o[i]=e[i]);var a=o,s=this._cache[r];return n&&s?this._loadData(Object.assign({},{key:r,cacheData:s},a)):this._getItem(r).then(function(e){return t._loadData(Object.assign({},{key:r,cacheData:e},a))}).catch(function(){return t._loadData(Object.assign({},{key:r},a))})},i.prototype._loadData=function(e){var t=this,r=e.key,n=e.syncFn,o=(e.reject,e.resolve,e.expires),i=e.cacheData,a=e.syncParams,s=e.isAutoSave,c="string"==typeof i,u=function(){return n(a).then(function(e){return null==e.code&&null==e.data?{data:e}:e}).then(function(e){var t=e.code;void 0===t&&(t=0);return{code:+t,data:e.data}}).then(function(e){var n=e.code,i=e.data;return 0===n&&s?(t.save({key:r.replace(t.storageKeyPrefix,""),data:{code:n,data:i},expires:o}).catch(console.warn),{code:n,data:i}):{code:n,data:i}})},g=function(){return Promise.reject(new Error(JSON.stringify({key:r,syncFn:n})))};if(null===i||void 0===i)return n?u():g();var l=(i=c?JSON.parse(i):i).expires,f=i.rawData;return l>=parseInt(Date.now()/1e3)?Promise.resolve(f):n?u():g()},e.DEFAULT_EXPIRES=30,e.DEFAULT_KEY_PREFIX=n,e.MSG_KEY=o,e.default=i,Object.defineProperty(e,"__esModule",{value:!0})});