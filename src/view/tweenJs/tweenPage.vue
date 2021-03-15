<template>
	<div class="tweenMain">
		<div class="tween-content">
			<h3>tween.js - 补间动画库</h3>
			<div>
				<h4 class="tween-title">基础用法</h4>

				<div class="tween-body">
					<div ref='startDom' class="Dom-style"></div>

					<el-form label-position="left" label-width="100px" :model="formFirst" size="small">
						<el-form-item label="运行开关 :">
							<el-radio-group v-model="formFirst.begin" @change="tweenStart">
								<el-radio :label="true">开始</el-radio>
								<el-radio :label="false">暂停</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item label="运行次数 :">
							<el-select v-model="formFirst.isRepeat" @change="updateTween">
								<el-option label="无限重复 - Infinity" value='Infinity'></el-option>
								<el-option label="重复 4 次" value='3'></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="循环模式 :">
							<el-radio-group v-model="formFirst.loop" @change="updateTween">
								<el-radio :label="false">正常重复</el-radio>
								<el-radio :label="true">yoyo重复</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item label="运行时长 (s) :">
							<el-slider v-model="formFirst.speed" input-size='mini' :step="1" show-stops :min='1'
								:max="10" @change="updateTween">
							</el-slider>
						</el-form-item>

						<el-form-item label="运行延迟 (s) :">
							<el-slider input-size='mini' v-model="formFirst.delay" :step="1" show-stops :max="10"
								@change="updateTween">
							</el-slider>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="marTop">
				<h4 class="tween-title">tween.js 缓动函数</h4>
				<div class="tween-body">
					<div ref='easingDom' class="Dom-style"></div>

					<div>
						<el-form label-position="left" label-width="100px" :model="formSecond" size="small">
							<el-form-item label="运行开关 :">
								<el-radio-group v-model="formSecond.begin" @change="tweenStartEsa">
									<el-radio :label="true">开始</el-radio>
									<el-radio :label="false">暂停</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="曲线类型 :">
								<el-select v-model="formSecond.curveData" placeholder="请选择" size="small"
									@change='getCurver("T")'>
									<el-option v-for="item in bufferCurve" :key="item.value" :label="item.label"
										:value="item.value">
										<span class="curveLeft">{{ item.value }}</span>
										<span class="curveRight">{{ item.label }}</span>
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="曲线速度 :">
								<el-select v-model="formSecond.speed" :disabled="formSecond.curveData=='Linear'"
									@change='getCurver("S")' placeholder="请选择" size="small">
									<el-option v-for="item in curveSpeed" :key="item.value" :disabled="item.disable"
										:label="item.label" :value="item.value">
										<span class="curveLeft">{{ item.value }}</span>
										<span class="curveRight">{{ item.label }}</span>
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="曲线结果 :">
								<span
									class="curverRsult">TWEEN.Easing.{{formSecond.curveData}}.{{formSecond.speed}}</span>
							</el-form-item>

							<el-form-item label="曲线图列 :">
								<div ref='curverDom' class="curver-color"></div>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>

			<div class="document">
				<h4 class="weight-400">补间功能方法</h4>
					<el-table :data="attrTable" >
						<el-table-column prop="param" label="参数" width="120px">
						</el-table-column>
						<el-table-column prop="explain" label="说明" >
						</el-table-column>
						<el-table-column prop="optValue" align="center" label="可选值" width="120px">
						</el-table-column>
						<el-table-column prop="optType" align="center" label="类型" width="120px">
						</el-table-column>
						<el-table-column prop="defValue" align="center" label="默认值" width="120px">
						</el-table-column>
					</el-table>

				<h4 class="weight-400">补间操作方法</h4>
					<el-table :data="operatTable" >
						<el-table-column prop="way" label="方法名" width="120px">
						</el-table-column>
						<el-table-column prop="explain" label="说明" >
						</el-table-column>
						<el-table-column prop="Param" label="参数" width="400px">
						</el-table-column>
					</el-table>
					
				<h4 class="weight-400">补间回调函数</h4>
					<el-table :data="callbackTable"  >
						<el-table-column prop="way" label="事件名称" width="120px">
						</el-table-column>
						<el-table-column prop="explain" label="说明" >
						</el-table-column>
						<el-table-column prop="Param"  label="回调参数" width="200px">
						</el-table-column>
					</el-table>	
					
					<div class="placeholder"></div>
			</div>




		</div>
	</div>
</template>

<script>
	import * as THREE from "three";
	import * as TrackballControls from 'three-trackballcontrols'
	import * as ThreeStats from 'three-stats'
	import Easing from '../../../public/file/Easing.json'
	import createGraph from '../../utils/createGraph.js'
	const OrbitControls = require('three-orbit-controls')(THREE);
	const TWEEN = require('@tweenjs/tween.js')
	export default {
		props: {
			msg: String
		},
		data() {
			return {
				renderer: '', //渲染器 初始
				rendererEsa: '', //缓动渲染器

				scene: '', //场景
				sceneEsa: '', //缓动场景

				light: '', //光源
				camera: '', //相机
				cameraEsa: '', //缓动相机

				controls: '', //控制器
				controlsEsa: '', //缓动控制器

				stats: '', //性能监控器
				mygroup: '', //模型组

				meshHello: '', //第一个three模型	
				meshEsa: '', //缓动模型

				startDom: '', //初始dom

				helloTween: '', //第一个tween
				EsaTween: '', //缓动函数补间
				formFirst: {
					begin: true,
					isRepeat: '3',
					loop: false,
					speed: 2,
					delay: 1,
				},
				formSecond: {
					begin: true,
					curveData: 'Linear',
					speed: 'None',
				},
				defaultCurve: '', //配置好的运行曲线值
				bufferCurve: [], //曲线类型
				curveSpeed: [ //曲线速度
					{
						value: 'In',
						label: '先慢后快'
					},
					{
						value: 'Out',
						label: '先快后慢'
					},
					{
						value: 'InOut',
						label: '前半段加速，后半段减速'
					},
					{
						value: 'None',
						label: '平均速度',
						disable: true,
					},
				],
				attrTable: [
					{ //属性文档
					param: 'start()',
					explain: 'new TWEEN.Tween().start(time) , start 方法接受一个参数 time , 如果加入参数,那么补间不会立即开始直到特定时刻才会开始',
					optValue: '-', //可选值
					optType:'date(ms)',
					defValue: '-', //默认值
					}, 
					
					{ //属性文档
					param: 'stop()',
					explain: 'new TWEEN.Tween().stop() , 关闭这个正在执行的补间',
					optValue: '-', //可选值
					optType:'',
					defValue: '-', //默认值
					}, 
					{
					param: 'repeat()',
					explain: 'new TWEEN.Tween().repeat(), repeat 它接受一个参数 , 描述第一个补间完成后需要多少次重复',
					optValue: '数字 / Infinity', //可选值
					optType:'number(int)',
					defValue: '0', //默认值
					},
					 {
					 param: 'yoyo()',
					 explain: 'new TWEEN.Tween().yoyo() ,  这个功能只有在使用 repeat 时才有效果 , 补间的行为将像悠悠球一样来回运动 , 而不是重新开始',
					 optValue: 'true / false', //可选值
					 optType:'boolean',
					 defValue: 'false', //默认值
					 }, 
					 {
					 param: 'delay()',
					 explain: 'new TWEEN.Tween().delay() , 补间开始之前的延迟时间',
					 optValue: '-', //可选值
					 optType:'date(ms)',
					 defValue: '-', //默认值
					 }, 
					 {
					 param: 'pause()',
					 explain: 'new TWEEN.Tween().pause() , 暂停当前补间运动',
					 optValue: '-', //可选值
					 optType:'-',
					 defValue: '-', //默认值
					 }, 
					{
					param: 'resume()',
					explain: 'new TWEEN.Tween().resume() , 恢复这个已经被暂停的补间运动',
					optValue: '-', //可选值
					optType:'-',
					defValue: '-', //默认值
					},  
					{
					param: 'to()',
					explain: 'new TWEEN.Tween().to() ,  当tween启动时，Tween.js将读取当前属性值并应用相对值来找出新的最终值',
					optValue: '-', //可选值
					optType:'-',
					defValue: '-', //默认值
					}, 	
				],

				operatTable:[
					{
					way:'update()',
					explain:'TWEEN.update() , 动态更新补间运动',
					Param:'update(time) 如果 time 不指定 , 使用当前时间',
				   },
				   {
				   	way:'getAll()',
				   	explain:'TWEEN.getAll() , 得到所有的补间组',
				   	Param:' - ',
				   },
				   {
				   	way:'removeAll()',
				   	explain:'TWEEN.removeAll() , 删除所有的补间组',
				   	Param:'-',
				   },
				   {
				   	way:'add(tween)',
				   	explain:'TWEEN.add(tween) , 添加一个特定的补间',
				   	Param:'(tween) 添加一个特定的补间 var tween=new TWEEN.Tween()',
				   },
				   {
				   	way:'remove(tween)',
				   	explain:'TWEEN.remove(tween) , 删除一个特定的补间',
				   	Param:'(tween) 删除一个特定的补间 var tween=new TWEEN.Tween()',
				   },
				   {
				   	way:'Group()',
				   	explain:'var Group=TWEEN.Group() , 新增一个补间组',
				   	Param:'new TWEEN.Tween({ x: 1 }, Group) ,将已经配置好的补间进行分组 , TWEEN.update()和TWEEN.removeAll(),不会影响到已经分好组的补间',
				   },
				],
				callbackTable:[
					{
					way:'onStart()',
					explain:'new TWEEN.Tween().onStart((obj)=>{}) , 补间开始时执行,只执行一次, 当使用  repeat() 重复补间时,不会重复运行',
					Param:'onStart((obj)=>{}) obj 补间对象作为第一个参数传入',
					},
					{
					way:'onStop()',
					explain:'new TWEEN.Tween().onStop((obj)=>{}) , 当通过 onStop() 显式停止补间时执行，但在正常完成时并且在停止任何可能的链补间之前执行补间',
					Param:'onStop((obj)=>{}) obj 补间对象作为第一个参数传入',
					},
					{
					way:'onUpdate()',
					explain:'new TWEEN.Tween().onUpdate((obj)=>{}) , 每次补间更新时执行，返回实际更新后的值',
					Param:'onUpdate((obj)=>{}) obj 补间对象作为第一个参数传入',
					},
					{
					way:'onComplete()',
					explain:'new TWEEN.Tween().onComplete((obj)=>{}) , 当补间正常完成（即不停止）时执行',
					Param:'onComplete((obj)=>{}) obj 补间对象作为第一个参数传入',
					},
				]
			}
		},
		mounted() {
			this.bufferCurve = Easing; //导入缓动参数
			this.getCurver('T')
			this.init(); //初始化
		},
		methods: {
			init() {
				this.rendererInit(); //创建渲染器
				this.sceneInit(); //创建场景    包含光源和辅助坐标系
				this.cameraInit(); //创建相机
				this.controlInit(); //初始化控制器
				this.modelling(); //建立模型
			},
			rendererInit() { //初始化渲染器
				var width = 500; //窗口宽度	
				var height = 400; //窗口高度
				this.renderer = new THREE.WebGLRenderer(); //创建渲染器
				this.rendererEsa = new THREE.WebGLRenderer(); //创建缓动渲染器

				this.renderer.setClearColor(0xffffff); //添加背景颜色
				this.renderer.setSize(width, height); // 设定渲染器尺寸

				this.rendererEsa.setClearColor(0xffffff); //添加缓动背景颜色
				this.rendererEsa.setSize(width, height); // 设定缓动渲染器尺寸

				this.$refs.startDom.appendChild(this.renderer.domElement);
				this.$refs.easingDom.appendChild(this.rendererEsa.domElement);

			},
			sceneInit() { //初始化场景 并向场景添加光源和辅助坐标系
				this.scene = new THREE.Scene();
				this.sceneEsa = new THREE.Scene();
				var ambient = new THREE.AmbientLight(0x444444, 2); //添加光源  颜色和光照强度
				var axisHelper = new THREE.AxesHelper(1000); //添加辅助坐标系

				var ambientEsa = new THREE.AmbientLight(0x444444, 2); //添加光源  颜色和光照强度
				var axisHelperEsa = new THREE.AxesHelper(1000); //添加辅助坐标系

				this.scene.add(ambient, axisHelper);

				this.sceneEsa.add(ambientEsa, axisHelperEsa);
			},
			cameraInit() { //初始化相机
				var width = 600; //窗口宽度
				var height = 600; //窗口高度	
				var k = width / height; //窗口宽高比
				var s = 50; //三维场景显示范围控制系数，系数越大，显示的范围越大
				//创建相机对象
				this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000); //使用透视相机
				this.camera.position.set(100, 100, 100); //设置相机位置
				this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 相机看向

				this.cameraEsa = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000); //使用透视相机
				this.cameraEsa.position.set(0, 50, 100); //设置相机位置
				this.cameraEsa.lookAt(new THREE.Vector3(0, 0, 0)); // 相机看向

			},
			controlInit() { //初始化控制器
				this.controls = new OrbitControls(this.camera, this.$refs.startDom); // 初始化控制器

				this.controlsEsa = new OrbitControls(this.cameraEsa, this.$refs.easingDom); // 初始化控制器

				this.controls.target.set(0, 0, 0); // 设置控制器的焦点，使控制器围绕这个焦点进行旋转

				//this.controls.minDistance = 10; // 设置移动的最短距离（默认为零）
				//this.controls.maxPolarAngle = Math.PI; //绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
				//this.controls.maxDistance = 30; // 设置移动的最长距离（默认为无穷）
				//this.controls.enablePan = true; //禁用右键功能
				this.controls.addEventListener('change', this.refresh); //监听鼠标、键盘事件 让整个控件可以拖动	
				this.controlsEsa.addEventListener('change', this.refreshEsa); //监听鼠标、键盘事件 让整个控件可以拖动
			},
			refresh() { //刷新页面
				this.renderer.render(this.scene, this.camera); //执行渲染操作			
			},

			refreshEsa() {
				this.rendererEsa.render(this.sceneEsa, this.cameraEsa); //执行渲染操作		
			},


			modelling() { //开始建立模型
				var geometry = new THREE.BoxGeometry(6, 7, 6, 4, 4, 4);
				var material = new THREE.MeshLambertMaterial({
					color: '#409EFF',
					wireframe: true,
				}); //材质对象Material
				this.meshHello = new THREE.Mesh(geometry, material);
				this.meshHello.position.set(-40, 0, 0);
				this.scene.add(this.meshHello);

				var geometryEsa = new THREE.BoxGeometry(6, 7, 6, 4, 4, 4);
				var materialEsa = new THREE.MeshLambertMaterial({
					color: '#409EFF',
					wireframe: true,
				}); //材质对象Material
				this.meshEsa = new THREE.Mesh(geometryEsa, materialEsa);
				this.meshEsa.position.set(-30, 0, 35);
				this.sceneEsa.add(this.meshEsa);


				this.addTween(this.meshHello); //开启补间动画 
				this.addTweenEsa(this.meshEsa); //开启补间动画 缓动函数

				this.refresh();
				this.refreshEsa();
				this.animate(); //循环渲染

			},

			updateTween() {
				TWEEN.remove(this.helloTween); //清除上一次的补间重新加载
				this.addTween(this.meshHello, 'restore')
			},

			addTween(mesh) {
				this.meshHello.position.set(-30, 0, 0);
				this.meshHello.rotation.set(0, 0, 0);
				this.helloTween = new TWEEN.Tween([mesh.position, mesh.rotation])
					.to([{
						x: 50,
						y: 0,
						z: 30
					}, {
						x: Math.PI,
						y: Math.PI,
						z: Math.PI
					}], parseInt(this.formFirst.speed * 1000))
					.delay(this.formFirst.delay * 1000)
					.yoyo(this.formFirst.loop)
					.easing(TWEEN.Easing.Linear.None)
					.repeat(this.formFirst.isRepeat)
					.onUpdate(() => {})
				this.helloTween.start()
			},

			addTweenEsa(mesh) {
				this.meshEsa.position.set(-30, 0, 35);
				this.EsaTween = new TWEEN.Tween(mesh.position)
					.to({
						x: 30,
						y: 0,
						z: 30
					}, 2000) 
					.delay(1000)
					.yoyo(true)
					.easing(this.defaultCurve)
					.repeat(Infinity)
				this.EsaTween.start()
			},


			animate() { // 渲染
				this.renderer.render(this.scene, this.camera);
				this.rendererEsa.render(this.sceneEsa, this.cameraEsa);

				window.requestAnimationFrame(() => this.animate());
				TWEEN.update()
			},
			tweenStart(val) { //开始或者暂停动画
				if (val) {
					this.helloTween.resume();
				} else {
					this.helloTween.pause();
				}
			},
			tweenStartEsa(val){
				if (val) {
					this.EsaTween.resume();
				} else {
					this.EsaTween.pause();
				}
			},

			getCurver(type) {
				if (type == 'T' && this.formSecond.curveData == 'Linear') {
					this.formSecond.speed = 'None';
				} else if (type == 'T') {
					this.formSecond.speed = 'In';
				}

				var dom = this.$refs.curverDom;
				if (dom.childNodes[0] != undefined) { //如果已经有值了 则删除
					dom.removeChild(dom.childNodes[0])
				}

				var curverType = this.formSecond.curveData + '.' + this.formSecond.speed;

				var Data = createGraph(curverType)
				dom.appendChild(Data.dom)
				this.defaultCurve = Data.curver;

				if (this.EsaTween) {
					TWEEN.remove(this.EsaTween); //清除上一次的补间重新加载
					this.addTweenEsa(this.meshEsa)
				}

			},

		}
	}
</script>

<style scoped>
	.tweenMain {
		display: flex;
		justify-content: center;
	}

	.tween-content {
		max-width: 1300px;
		padding: 15px;
		background-color: #FFFFFF;
		overflow: auto;
	}

	.tween-body {
		display: flex;
		flex-direction: row;
		justify-content: center;
		border: 1px solid #DCDFE6;
		border-top-right-radius: 5px;
		border-top-left-radius: 5px;
		padding: 10px;
		min-width: 900px;
	}

	.Dom-style {
		margin-right: 10px;

	}

	.curverRsult {
		font-weight: 600;
	}

	.curver-color {
		background: #FAFAFA;
		width: 200px;
		height: 100px;
	}

	.curveLeft {
		float: left
	}

	.curveRight {
		margin-left: 10px;
		float: right;
		color: #8492a6;
		font-size: 13px
	}
	.weight-400{
		font-weight: 400;
		margin-top: 60px;
	}

	.marTop {
		margin-top: 40px;
	}

	.document {
		margin-top: 50px;
	}
	.placeholder{
		height:200px;
	}
</style>
