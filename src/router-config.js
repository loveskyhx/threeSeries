import Home from './view/Main.vue';

import panoramaPage from './view/panorama/panoramaPage.vue';

import tweenPage from './view/tweenJs/tweenPage.vue';

const routeConfig = [
{
    path: '/',
    component: Home,
    name: '首页',
	
	children: [
	    
	    {
	        path: '/panorama',
	        component: panoramaPage,
	        name: '全景图',
	    },
	    
		
		
	    {
	        path: '/tweenPage',
	        component: tweenPage,
	        name: 'tween.js用法',
	    },
		
		]
},


];

export default routeConfig;