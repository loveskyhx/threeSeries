<template>
	<div class="homePage">
		<el-container class='height-100'>
			<el-header class='homePage-head'>
				<span class="homePage-span" v-for="(item,index) in routerIndex" @click="crumbs(item)"> {{item.name}}</span>
			</el-header>

			<el-main class='height-100 scrollBar'>
				<transition name="fade" mode="in-out">
					<div class='homePage-titles'>
						<div v-if='isShow' class="homePage-titles-card" :key='index' @click='openPage(item)' v-for="(item,index) in list">
							<el-card class="homePage-card" :body-style="{ padding: '0px',margin:'5px' }" shadow="hover">
								<img class="homePage-img" :src="item.titleImg">
								<div class="card-pad">
									<div class="homePage-bottom">
										<span class="time">{{ item.name }}</span>
									</div>
								</div>
							</el-card>
						</div>
					</div>
				</transition>

				<transition name="fade">
					<router-view></router-view>
				</transition>
			</el-main>
		</el-container>

	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		props: {},
		watch: {
			$route(to, from){
				if (to.path == '/') {
					this.isShow = true; //显示菜单
					this.reCord = '/';
					this.routerIndex = [{ //重置导航
						name: '首页 /',
						router: '/',
					}, ]
				} else {
					this.isShow = false; //显示菜单
				}
			}
		},

		data() {
			return {
				isShow: true, //是否显示菜单
				reCord: '/', //记录当前位置 默认首页
				list: [{
						name: '简易全景图',
						router: '/panorama',
						titleImg: require('../../public/img/title/title1.png')
					},
					{
						name: 'tween.js用法',
						router: '/tweenPage',
						titleImg: require('../../public/img/title/title2.png')
					},
				],
				routerIndex: [{
					name: '首页 /',
					router: '/',
				}, ]
			}
		},

		mounted(){
			this.checkRouter();
		},

		methods: {
			openPage(item) {
				if (this.reCord == item.router) return
				this.isShow = false;
				this.$router.push(item.router) //通过push进行跳转
				this.routerIndex = [{
					name: '首页 /',
					router: '/',
				}, ]
				this.reCord = item.router;
				this.routerIndex.push({
					name: item.name,
					router: item.router,
				})

			},

			crumbs(val) { //切换页面
				if (this.reCord == val.router) return
				this.$router.push(val.router) //通过push进行跳转
			},

			checkRouter(){ //检查当前路由
			if(this.$router.history.current.fullPath!='/'){
				this.isShow=false;
				this.reCord=this.$router.history.current.fullPath;
				this.routerIndex.push({
					name: this.$router.history.current.name,
					router: this.$router.history.current.fullPath,
				})
			}
					
			},


		},
	}
</script>

<style>
	.homePage {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.homePage-head {
		padding: 18px 0px 18px 30px !important;
		border-bottom: 1px solid #DCDFE6;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .02), 0 0 6px rgba(0, 0, 0, .04);
	}

	.homePage-span {
		margin-left: 2px;
		font-size: 13px;
		color: #606266;
		cursor: pointer;
		font-weight: 100;
	}

	.homePage-span:first-child {
		font-size: 14px;
		color: #303133;
		font-weight: 600;
		margin-left: 0px;
	}

	.homePage-span:hover {
		transition: color 0.1s linear;
		color: #409EFF;
	}

	.homePage-titles {
		position: absolute;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: calc(100% - 40px);
	}

	.homePage-titles-card {
		display: inline-block;
	}

	.homePage-card {
		cursor: pointer;
		margin: 10px 20px;
	}

	.card-pad {
		padding: 14px;
	}

	.homePage-img {
		width: 330px;
		object-fit: contain;
	}

	.homePage-card:hover {
		opacity: 0.9;
		transform: scale(1.05);
	}

	.homePage-bottom {
		text-align: center;
		font-weight: 600;
		font-size: 17px;
	}

	.height-100 {
		height: 100%;
	}

	.el-card {
		border: 1px solid #E4E7ED !important;
	}
	
	.el-table th{
		font-weight: 400;
	}
	.el-table td{
		font-weight: 400;
		font-size: 13px;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: all .3s ease;
	}

	.fade-enter,
	.fade-leave-active {
		opacity: 0;
	}
	
	.scrollBar::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 5px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
	}
	
	.scrollBar::-webkit-scrollbar-thumb:active {
		background: rgba(0, 0, 0, 0.4);
	}
	
	.scrollBar::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
		background: rgba(0, 0, 0, 0.1);
	}
	
	.scrollBar::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 4px;
		/*高宽分别对应横竖滚动条的尺寸*/
		height: 4px;
	}
</style>
