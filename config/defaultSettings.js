/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */
let baseUrlOptions;
if (!baseUrlOptions) {
    baseUrlOptions = {
        person1: "https://www.dlxxcd.com/aidSystem/",
		commonUrl: "https://www.dlxxcd.com/",
		model: "https://www.dlxxcd.com/model/",
		model1: "https://www.dlxxcd.com/model1/",
		// model: "http://192.168.101.16:8080/model/",
		// model: "https://www.dlxxcd.com/model1/",
		draco: "http://127.0.0.1:8081/draco/",
		// draco: "https://www.dlxxcd.com/draco/",
		mapImg: "https://www.dlxxcd.com/mapImg/",
		// mapImg: "http://192.168.43.137:8080/mapImg/"
		
    }
}
export default {
    primaryColor: "#52C41A", // primary color of ant design
    navTheme: "dark", // theme for nav menu
    layout: "sidemenu", // nav menu position: sidemenu or topmenu
    contentWidth: "Fixed", // layout of content: Fluid or Fixed, only works when layout is topmenu
    fixedHeader: false, // sticky header
    fixSiderbar: false, // sticky siderbar
    autoHideHeader: false, //  auto hide header
    colorWeak: false,
    multiTab: false,
    // vue-ls options
    storageOptions: {
        namespace: "pro__", // key prefix
        name: "ls", // name variable Vue.[ls] or this.[$ls],
        storage: "local" // storage name session, local, memory
    },
    baseUrl: baseUrlOptions
};
