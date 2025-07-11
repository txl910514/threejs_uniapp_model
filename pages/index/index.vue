<template>
	<view class="canvas_content">
		<canvas class="map_canvas" type="webgl" id="webgl" style="width: 100%; height: 100%;" @touchstart="touchstart"
			@touchmove="touchmove" @touchend="touchend" :disable-scroll="true">
		</canvas>
	</view>
</template>

<script>
	import * as WisdomThreeApplet from "@donglian/wisdom_three_applet";
	import LanqiuOrigin from "@/common/lanqiuOrigin";
	import ZuqiuOrigin from "@/common/zuqiuOrigin";
	import config from "@/config/defaultSettings.js";
	const baseUrl = config.baseUrl;
	let modelUrl = baseUrl.model;
	const dracoUrl = baseUrl.draco;
	const mapImg = baseUrl.mapImg;
		const commonUrl = baseUrl.commonUrl;
		if (getApp().globalData.$platform == "ios" && getApp().globalData.$phoneModel.indexOf("iPhone 6") > -1) {
			modelUrl = baseUrl.model1;
		}
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			var that = this;
			uni.createSelectorQuery().in(this)
				.select('#webgl')
				.node()
				.exec((res) => {
					const canvas = res[0].node;
					const THREE = WisdomThreeApplet.createScopedThreejs(canvas);
					// const LoaderModel = initGltfLoader(THREE, dracoUrl);
					var isMeshModel = true;
					if (getApp().globalData.$platform == "ios" && getApp().globalData.$phoneModel.indexOf("iPhone 6") >
						-1) {
						isMeshModel = false;
					}
					const LoaderModel = WisdomThreeApplet.initGltfLoader(THREE, null, isMeshModel);
					this.LoaderModel = LoaderModel;
					this.canvas = canvas;
					this.THREE = THREE;
					this.drawThreeDiMap(0);
				})
		},
		methods: {
			touchstart(e) {
				if (this.canvas) {
					// pointerdown
					this.canvas.dispatchTouchEvent(e)
					// this.canvas.dispatchTouchEvent({
					// 	...e,
					// 	type: 'touchstart'
					// })
				}
			},
			touchmove(e) {
				if (this.canvas) {
					this.canvas.dispatchTouchEvent(e)
					// this.canvas.dispatchTouchEvent({
					// 	...e,
					// 	type: 'touchmove'
					// })
				}
			},
			touchend(e) {
				if (this.canvas) {
					this.canvas.dispatchTouchEvent(e)
					// this.canvas.dispatchTouchEvent({
					// 	...e,
					// 	type: 'touchend'
					// })
				}
			},
			clearMap() {
				if (this.canvasZoom) {
					this.canvasZoom.destroy();
					this.canvasZoom = null;
				}
				this.routeTipsShow = "none";
				this.floorBoxArr = [];
			},
			drawThreeDiMap(scene) {
				var that = this;
				const fs = wx.getFileSystemManager();
				if (!this.LoaderModel) {
					return;
				}
				this.mapLoadErrShow = false;
				this.isMapLoading = true;
				// uni.showLoading({
				// 	title: '场馆地图加载中预计需要30s请耐心等待！',
				// 	mask: false
				// });
				if ((this.reqModels || []).length) {
					this.reqModels.forEach(v => {
						if (!v) {
							return;
						}
						v.abort();
					})
					this.reqModels.length = 0;
				}
				var now = new Date().getTime();
				// this.blueTooth_modal_show = false;
				this.clearMap();
				this.venues_type = scene;
				var originData = [];
				if (scene == 0) {
					originData = LanqiuOrigin;
				} else if (scene == 1) {
					originData = ZuqiuOrigin;
				}
				var that = this;
				var floorArr = [];
				var lanqiuchangFloor = [1, 2, 3, 4, 5, 6];
				// var lanqiuchangFloor = [6];
				var zuqiuchangFloor = [1, 2, 3, 4, 5, 6];
				// var zuqiuchangFloor = [1];
				var jsonName = "";
				if (scene == 0) {
					floorArr = lanqiuchangFloor;
					jsonName = "lanqiu-f";
				} else if (scene == 1) {
					floorArr = zuqiuchangFloor;
					jsonName = "zuqiu-f";
				}
				var numObj = {
					num: 0
				};
				var mapInfo = {};
				mapInfo.floor = [];
				floorArr.map((id, index) => {
					// https://cdn.liubaiwenhua.com/201812/ctree/resource/model/scene.glb
					if (!this.reqModels) {
						this.reqModels = [];
					}
					if(getApp().globalData.$originScene[jsonName + id]) {
						var jsonModelScene = getApp().globalData.$originScene[jsonName + id];
						this.loadGltfSucess(scene, numObj, jsonModelScene, floorArr, index, originData, mapInfo);
						console.log("进");
						return
					}
					var hasGltf, hasBin;
					try {
					  fs.accessSync(`${wx.env.USER_DATA_PATH}/${jsonName}${id}.gltf`)
					  hasGltf = true;
					} catch(e) {
					  console.error(e)
					}
					try {
					  fs.accessSync(`${wx.env.USER_DATA_PATH}/${jsonName}${id}.bin`);
					  hasBin = true;
					} catch(e) {
					  console.error(e)
					}
					var gltfUrl = modelUrl + jsonName + id + ".gltf";
					if (hasGltf && hasBin){
						gltfUrl = `${wx.env.USER_DATA_PATH}/${jsonName}${id}.gltf`;
						
					}
					// console.log(gltfUrl);
					var reqModel = this.LoaderModel(gltfUrl, (gltf) => {
						// this.LoaderModel("http://192.168.1.12:8080/honghu.gltf", (gltf) => {
						// console.log(gltf.scene);
						// getApp().globalData.$originScene[jsonName + id] = gltf.scene;
						this.loadGltfSucess(scene, numObj, gltf.scene, floorArr, index, originData, mapInfo);
					
					}, (errTtext) => {
						// console.log(errTtext, 364);
						if (this.venues_type !== scene) {
							return;
						}
						if ((this.reqModels || []).length) {
							this.reqModels.forEach(v => {
								if (!v) {
									return;
								}
								v.abort();
							})
							this.reqModels.length = 0;
						}
						this.mapLoadErrShow = true;
						this.isMapLoading = false;
						// uni.hideLoading();
					})
					this.reqModels.push(reqModel);
				});
			},
			loadGltfSucess (scene, numObj, moduleScene, floorArr, index, originData, mapInfo ) {
				var that = this;
				if (this.venues_type !== scene) {
					return;
				}
				numObj.num++;
				var floor = {};
				floor.module = moduleScene;
				floor.floor = floorArr[index];
				floor.origin = originData[index];
				floor.text = [];
				
				floor.textStyle = {
					// color: "#818D98",
					color: "#002122",
					fontSize: 16,
				};
				mapInfo.floor[index] = floor;
				if (numObj.num == floorArr.length) {
					
					this.canvasZoom = new WisdomThreeApplet.IndoorMap({
						canvas: this.canvas,
						THREE: this.THREE,
						background: "#000B27",
						// background: "transparent",
						mapInfo: mapInfo,
						pointImg: mapImg + "zhinanzhen.png",
						currentFloor: 1,
						defaultRoute: [{
							floor: 2,
							routes: [{
								color: "#05E7B2",
								width: 5,
								route: [
				
				
				
									// {
									// 	x: 20486516,
									// 	y: 30975122
									// },
									// {
									// 	x: 20483324,
									// 	y: 30987736
									// },
									// {
									// 	x: 20475083,
									// 	y: 30982611
									// },
									// {
									// 	x: 20454024,
									// 	y: 30976083
									// },
									// {
									// 	x: 20445533,
									// 	y: 30974936
									// }
				
				
								]
							}]
						}]
					});
					setTimeout(function() {
						var last = new Date().getTime();
						// uni.hideLoading();
						that.isMapLoading = false;
						that.$emit("mapLoad");
					}, 0);
							
					this.floorBoxArr = (mapInfo.floor || []).map(v => {
						return {
							floor: v.floor
						}
					});
				}
									
			},
		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
	}

	.canvas_content {
		background: red;
		width: 100%;
		height: 100%;
	}

	.map_canvas {
		width: 100%;
		height: 100%;
	}
</style>
