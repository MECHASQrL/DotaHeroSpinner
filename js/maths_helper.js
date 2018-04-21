function Vec2(x, y) {
	this.x = x;
	this.y = y;
}

function lerp(t, a, b) {
	return a + (b - a) * t;
}

function lengthVec2(v) {
	return Math.sqrt(v.x * v.x + v.y * v.y);
}

function normaliseVec2(v) {
	var newVec = new Vec2(0, 0);
	var length = lengthVec2(v);
	newVec.x = v.x / length;
	newVec.y = v.y / length;
	return newVec;
}

function scaleVec2(v, scaler) {
	var temp = new Vec2(0, 0);
	temp.x = v.x * scaler;
	temp.y = v.y * scaler;
	return temp;
}

function subVec2(a, b) {
	var temp = new Vec2(0, 0);
	temp.x = a.x - b.x;
	temp.y = a.y - b.y;
	return temp;
}

function addVec2(a, b) {
	var temp = new Vec2(0, 0);
	temp.x = a.x + b.x;
	temp.y = a.y + b.y;
	return temp;
}
