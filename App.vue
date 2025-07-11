<script>
	import Vue from 'vue';
	import config from "@/config/defaultSettings.js";
	const baseUrl = config.baseUrl;
	let modelUrl = baseUrl.model;
	export default {
		globalData: {
			$platform: '',
			$phoneModel: '',
			$originScene: {}
		},
		onLaunch: function() {
			console.log('App Launch');
			var that = this;
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.$platform = e.platform;
					Vue.prototype.$phoneModel = e.model;
					that.globalData.$platform = e.platform;
					that.globalData.$phoneModel = e.model;
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			this.downModel();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			downModel() {
				var floorArr = [1, 2, 3, 4, 5, 6];
				var sceneArr = ['lanqiu-f', 'zuqiu-f'];
				floorArr.forEach(floor => {
					sceneArr.forEach(sceneName => {
						this.downFile(sceneName + floor, 'gltf');
						this.downFile(sceneName + floor, 'bin');
					})
				})
			},
			downFile(fileName, suffix) { //下载文件
				let _this = this;
				const FileSystemManager = wx.getFileSystemManager();
				FileSystemManager.access({
					path: `${wx.env.USER_DATA_PATH}/${fileName}.${suffix}`,
					success(res) {
						// FileSystemManager.readFile({
						//   filePath: `${wx.env.USER_DATA_PATH}/${fileName}.${suffix}`,
						//   position: 0,
						//   success(res) {
						//     console.log(res.data)
						//   },
						//   fail(res) {
						//     console.error(res)
						//   }
						// })
					},
					fail(res) {
						// 文件不存在或其他错误
						new Promise((resolve, reject) => {
							wx.downloadFile({
								url: modelUrl + fileName + "." + suffix, // 
								timeout: 5 * 60 * 1000,
								success(res) {
									console.log(res.tempFilePath);
									if (res.statusCode === 200) {
										FileSystemManager.saveFile({ //下载成功后保存到本地
											tempFilePath: res.tempFilePath,
											filePath: wx.env.USER_DATA_PATH + "/" +
												fileName + '.' + suffix,
											success(res2) {
												if (res2.errMsg == 'saveFile:ok') {
													resolve()
												} else {
													reject()
												}
											},
											fail() {
												reject()
											}
										})
									} else {
										reject()
									}
								},
								fail() {
									reject()
								}
							})
						})
						// 同步接口
		
					}
				})
		
			}
		
		
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
