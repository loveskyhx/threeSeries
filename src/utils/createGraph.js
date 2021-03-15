const TWEEN = require('@tweenjs/tween.js')
var createGraph=function(f, c) {
	
	switch (f){
		case 'Linear.None':
			f=TWEEN.Easing.Linear.None;
			break;
		case 'Quadratic.In':
			f=TWEEN.Easing.Quadratic.In;
			break;
		case 'Quadratic.Out':
			f=TWEEN.Easing.Quadratic.Out;
			break;	
		case 'Quadratic.InOut':
			f=TWEEN.Easing.Quadratic.InOut;
			break;
		case 'Cubic.In':
			f=TWEEN.Easing.Cubic.In;
			break;	
		case 'Cubic.Out':
			f=TWEEN.Easing.Cubic.Out;
			break;
		case 'Cubic.InOut':
			f=TWEEN.Easing.Cubic.InOut;
			break;
		case 'Quartic.In':
			f=TWEEN.Easing.Quartic.In;
			break;	
		case 'Quartic.Out':
			f=TWEEN.Easing.Quartic.Out;
			break;
		case 'Quartic.InOut':
			f=TWEEN.Easing.Quartic.InOut;
			break;	
		case 'Quintic.In':
			f=TWEEN.Easing.Quintic.In;
			break;	
		case 'Quintic.Out':
			f=TWEEN.Easing.Quintic.Out;
			break;	
		case 'Quintic.InOut':
			f=TWEEN.Easing.Quintic.InOut;
			break;											
		case 'Sinusoidal.In':
			f=TWEEN.Easing.Sinusoidal.In;
			break;
		case 'Sinusoidal.Out':
			f=TWEEN.Easing.Sinusoidal.Out;
			break;
		case 'Sinusoidal.InOut':
			f=TWEEN.Easing.Sinusoidal.InOut;
			break;
		case 'Exponential.In':
			f=TWEEN.Easing.Exponential.In;
			break;	
		case 'Exponential.Out':
			f=TWEEN.Easing.Exponential.Out;
			break;	
		case 'Exponential.InOut':
			f=TWEEN.Easing.Exponential.InOut;
			break;	
		case 'Circular.In':
			f=TWEEN.Easing.Circular.In;
			break;	
		case 'Circular.Out':
			f=TWEEN.Easing.Circular.Out;
			break;	
		case 'Circular.InOut':
			f=TWEEN.Easing.Circular.InOut;
			break;	
		case 'Elastic.In':
			f=TWEEN.Easing.Elastic.In;
			break;	
		case 'Elastic.Out':
			f=TWEEN.Easing.Elastic.Out;
			break;	
		case 'Elastic.InOut':
			f=TWEEN.Easing.Elastic.InOut;
			break;	
		case 'Back.In':
			f=TWEEN.Easing.Back.In;
			break;	
		case 'Back.Out':
			f=TWEEN.Easing.Back.Out;
			break;	
		case 'Back.InOut':
			f=TWEEN.Easing.Back.InOut;
			break;	
		case 'Bounce.In':
			f=TWEEN.Easing.Bounce.In;
			break;	
		case 'Bounce.Out':
			f=TWEEN.Easing.Bounce.Out;
			break;	
		case 'Bounce.InOut':
			f=TWEEN.Easing.Bounce.InOut;
			break;																										
		default:
			break;
	}
	
	var div = document.createElement('div')
	div.style.display = 'inline-block'
	div.style.width = '100%'
	div.style.height = '120px'

	var canvas = document.createElement('canvas')
	canvas.width = 215
	canvas.height = 100

	var context = canvas.getContext('2d')
	context.fillStyle = 'rgb(250,250,250)'
	context.fillRect(0, 0, 215, 100)

	context.lineWidth = 0.5
	context.strokeStyle = 'rgb(230,230,230)'

	context.beginPath()
	context.moveTo(0, 20)
	context.lineTo(180, 20)
	context.moveTo(0, 80)
	context.lineTo(180, 80)
	context.closePath()
	context.stroke()

	context.lineWidth = 2
	context.strokeStyle = 'rgb(255,127,127)'

	var position = {x: 5, y: 80}
	var position_old = {x: 5, y: 80}

	new TWEEN.Tween(position).to({x: 210}, 2000).easing(TWEEN.Easing.Linear.None).start()
	new TWEEN.Tween(position)
		.to({y: 20}, 2000)
		.easing(f)
		.onUpdate(function () {
			context.beginPath()
			context.moveTo(position_old.x, position_old.y)
			context.lineTo(position.x, position.y)
			context.closePath()
			context.stroke()

			position_old.x = position.x
			position_old.y = position.y
		})
		.start()

	div.appendChild(canvas)
	
	var array={
		dom:div, //dom 类型
		curver:f, //曲线值
	}
	
	return array
}
export default createGraph
