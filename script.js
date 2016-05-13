(function() {
var nodeList = document.querySelectorAll(".commentarea > .sitetable > .comment");
for (var i = 0; i < nodeList.length; i++) {
	var node = nodeList[i];
	node.setAttribute("data-comment", i);
	preencher(node, i);
	appendLinkProximo(node);

	var childList = node.querySelectorAll(".comment");
	for (var j = 0; j < childList.length; j++) {
		var child = childList[j];
		appendLinkProximo(child);
		appendLinkProximo(child, 1);
	}
}

function createLink(texto, funcao) {
	var link = document.createElement('a');
	link.href = "javascript:void(0)";
	link.innerHTML = texto;
	if (funcao) {
		link.onclick = funcao;
	}
	return link;
}

function appendLink(node, link) {
	var span = document.createElement("span");
	var open = document.createTextNode("[");
	var close = document.createTextNode("]");

	span.appendChild(open);
	span.appendChild(link);
	span.appendChild(close);

	var p = node.querySelector("p.tagline");
	p.appendChild(span);
}

function createLinkProximo(node, up) {
	var data = node.getAttribute("data-comment");
	var funcao = function nextCommentWrap(data, original, up) {
		return function() {nextComment(data, original, up);};
	};

	var texto = "Proximo";
	if (up !== undefined) {
		texto += " " + up;
	}
	var link = createLink(texto, funcao(data, "", up));
	return link;
}

function createLinkTop(node) {
	var data = node.getAttribute('data-comment');
	var funcao = function nextCommentWrap(data, original, up, nav) {
		return function() {nextComment(data, original, up, nav);};
	};

	var texto = "Top";
	var link = createLink(text, funcao(data, '', -1, false));
	return link;
}

function appendLinkProximo(node, up) {
	var link = createLinkProximo(node, up);
	appendLink(node, link);
}

function appendLinkTop(node) {
	var link = createLinkTop(node);
	appendLink(node, link);
}

// navigates to next comment
// nav defines if just goes up (false) or goes to next (true) [default]
function nextComment(data, original, up, nav) {
	if (!original) {
		original = data;
	}

	console.log("atual: " + data);
	
	data = findNextComment(data, up, nav);
	
	console.log("proximo: " + data);
	var selector = '[data-comment="' + data + '"]';
	var node = document.querySelector(selector);
	// if next node does not exist
	if (!node){
		console.log("nao existe");
		//go up one and find next, unless is already at top of thread
		if (data.length > 0) {
			nextComment(data, original, 1);
		} else {
			insertDiv("Não existe");
		}
	} else {
		// if node is hidden, do not navigate (should never happen)
		if (node.style.display == 'none') {
			nextComment(data, original);
		} else {
			// scroll to next and show div with progress
			node.scrollIntoView();
			insertDiv(original + " > " + data);
		}
	}
}

// up defines the number of levels to go up. if = -1, goes to top parent
// nav defines if just goes up (false) or goes to next (true) [default]
function findNextComment(data, up, nav) {
	if (nav === undefined) {
		nav = true;
	}
	// split data into array
	var split = data.split(".");

	if (up == -1) {
		// top parent is the first value in the array
		split = split[0];
	} else {
		// remove last 'up' digits from array
		split.splice(-up, up);
	}
	var next;
	if (nav) {
		if (split.length > 0) {
			// defines next comment to go to (adding 1 to last number of array)
			next = parseInt(split[split.length-1],10);
			next++;
			// substitues last number in array with the next
			split.splice(-1, 1, next);
		}
	}
	data = split.join(".");
	return data;
}

function preencher(node, data) {
	var childList = node.querySelectorAll(":scope > .child > .listing > .comment");
	for (var i = 0; i < childList.length; i++) {
		var child = childList[i];
		var dataChild = data+"."+i;
		if (!child) {
			alert(i);
			alert(data);
			alert(dataChild);
		}
		child.setAttribute("data-comment", dataChild);
		if (child.querySelector(".child").children.length > 0) {
			preencher(child, dataChild);
		}
	}
}

function createDiv(text) {
	var div = document.createElement("div");
	div.innerHTML = text;
	div.style.position = "fixed";
	div.style.backgroundColor = "#EFDB07";
	div.style.zIndex = "999";
	div.style.bottom = "2px";
	div.style.left = "0";
	div.style.right = "0";
	div.style.marginLeft = "auto";
	div.style.marginRight = "auto";
	div.style.padding= "5px 0 5px 0";
	div.style.textAlign = "center";
	div.style.width = "50%";
	div.style.borderWidth = "1px";
	div.style.borderStyle = "solid";
	return div;
}

function insertDiv(text) {
	var div = createDiv(text);
	setTimeout(function(){div.parentNode.removeChild(div);}, 1500);
	document.body.appendChild(div);
}
})()