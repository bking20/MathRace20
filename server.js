// Generated by Haxe 4.2.0-rc.1+686e7218e
(function ($global) { "use strict";
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
Math.__name__ = true;
var Server = function() {
	this.queue = [];
	this.connections = [];
	var _gthis = this;
	var ws = new ws_Server({ port : 9620});
	ws.on("connection",function(s) {
		var socket = s;
		console.log("src/Server.hx:20:","connection " + _gthis.connections.length);
		socket.send("init");
		var connection = { socket : socket, gid : -1, group : [], started : false, pin : -1, id : -1, count : 1};
		_gthis.connections.push(connection);
		socket.on("pong",function() {
		});
		var incoming = function(msg) {
			var message = msg;
			var array = (js_Boot.__cast(message , String)).split(",");
			if(connection.started) {
				var _g = 0;
				var _g1 = connection.group;
				while(_g < _g1.length) {
					var c = _g1[_g];
					++_g;
					c.socket.send("" + connection.id + "," + Std.string(msg));
				}
			} else {
				switch(array[0]) {
				case "gid":
					connection.gid = Std.parseInt(array[1]);
					connection.socket.send("gid");
					break;
				case "pin":
					_gthis.matchmake(connection,Std.parseInt(array[1]),Std.parseInt(array[2]));
					break;
				case "rnd":
					_gthis.matchmake(connection,Std.parseInt(array[1]));
					break;
				default:
					connection.socket.send("err,tag invalid");
				}
			}
		};
		socket.on("message",incoming);
	});
	var ping = function() {
		var jsIterator = ws.clients.values();
		var _g_jsIterator = jsIterator;
		var _g_lastStep = jsIterator.next();
		while(!_g_lastStep.done) {
			var v = _g_lastStep.value;
			_g_lastStep = _g_jsIterator.next();
			var client = v;
			if(client.readyState == client.CLOSED) {
				client.terminate();
			}
			client.ping();
		}
	};
	var tmp = ping;
	window.setInterval(tmp,30000);
};
Server.__name__ = true;
Server.main = function() {
	new Server();
};
Server.prototype = {
	matchmake: function(connection,count,pin) {
		if(pin == null) {
			pin = -1;
		}
		connection.group = [];
		connection.pin = pin;
		if(count == null) {
			count = 1;
		}
		connection.count = count;
		var _g = 0;
		var _g1 = this.queue;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.gid == connection.gid && (pin == -1 || c.pin == pin) && count >= c.count) {
				connection.group.push(c);
				if(--count <= 0) {
					break;
				}
			}
		}
		if(connection.group.length > 0 && count <= 0) {
			var players = connection.group.length;
			var id = 0;
			var _g = 0;
			var _g1 = connection.group;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.group = connection.group.slice();
				HxOverrides.remove(c.group,c);
				c.group.push(connection);
				c.socket.send("start," + players);
				c.started = true;
				c.pin = -1;
				HxOverrides.remove(this.queue,c);
				c.id = id++;
			}
			connection.socket.send("start," + players);
			connection.started = true;
			connection.pin = -1;
			connection.id = id;
			HxOverrides.remove(this.queue,connection);
		} else {
			connection.group = [];
			this.queue.push(connection);
			connection.socket.send("queue");
		}
	}
	,__class__: Server
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	__class__: haxe_ValueException
});
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var ws_Server = require("ws").Server;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
Server.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
