NodeList.prototype.each = function (fn) {
	var len = this.length;
	var idx = -1;
	while (++idx < len) {
		fn.call(this, this[idx], idx, this);
	}
};

Array.prototype.some = function (fn) {
	var len = this.length;
	var idx = -1;
	while (++idx < len) {
		if (fn(this[idx], idx, this)) {
			return true;
		}
	}
	return false;
};
