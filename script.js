var nodeList = document.querySelectorAll(".commentarea > .sitetable > .comment");
for (var i = 0; i < nodeList.length; i++) {
	var node = nodeList[i];
	node.setAttribute("data-comment", i);
	preencher(node, i);
	appendLinkProximo(node);
	appendLinkHide(node);
	appendLinkShow(node);

	var childList = node.querySelectorAll(".comment");
	for (var j = 0; j < childList.length; j++) {
		var child = childList[j];
		appendLinkProximo(child);
		appendLinkProximo(child, 1);
		appendLinkHide(child);
		appendLinkShow(child);
	}
}

function hide(node) {
	node.style.height = "23px";
  	node.style.overflow = "hidden";
}

function show(node) {
	node.style.height = "";
  	node.style.overflow = "";
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
	var p = node.querySelector("p.tagline");
	p.appendChild(link);
}

function createLinkShow(node) {
	var data = node.getAttribute("data-comment");
	var childList = node.querySelectorAll(":scope > .child > .listing > .comment");
	var funcao;
	if (childList.length > 0) {
		funcao = function showWrap(node, childList) {
			return function() {
				show(node);
				for (var i = 0; i < childList.length; i++) {
					var child = childList[i];
					show(child);
				}

			};
		};
	} else {
		funcao = function divWrap(node) {
			return function() {
				show(node);
				insertDiv("Não existe");
			};
		};
	}
	return createLink("mostrar", funcao(node, childList));
}

function appendLinkShow(node) {
	var link = createLinkShow(node);
	appendLink(node, link);
}

function createLinkHide(node) {
	var funcao = function hideWrap(node) {
		return function() {hide(node);};
	}
	var link = createLink("esconder", funcao(node));
	return link;
}

function appendLinkHide(node) {
	var link = createLinkHide(node);
	appendLink(node, link);
}

function createLinkProximo(node, up) {
	var data = node.getAttribute("data-comment");
	var funcao = function nextCommentWrap(i, original, up) {
		return function() {nextComment(i, original, up);};
	}

	var link = createLink("proximo", funcao(data, "", up));
	return link;
}

function appendLinkProximo(node, up){
	var link = createLinkProximo(node, up);
	appendLink(node, link);
}

function nextComment(data, original, up) {
	if (!original) {
		original = data;
	}
	console.log("atual: " + data);
	data = findNextComment(data, up);
	console.log("proximo: " + data);
	var selector = '[data-comment="' + data + '"]';
	var node = document.querySelector(selector);
	if (!node){
		console.log("nao existe");
		if (data.length > 0) {
			nextComment(data, original, 1);
		} else {
			insertDiv("Não existe");
		}
	} else {
		if (node.style.display == 'none') {
			nextComment(data, original);
		} else {
			node.scrollIntoView();
			insertDiv(original + " > " + data);
		}
	}
}

function findNextComment(data, up) {
	var split = data.split(".");
	switch(up) {
		case 1:
			split.splice(-1, 1);
			break;
		case -1: 
			split.push(-1);
			break;
	}
	var next;
	if (split.length > 0) {
		next = parseInt(split[split.length-1],10);
		next++;
		split.splice(-1, 1, next);
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
	document.body.appendChild(div);
	setTimeout(function(){div.parentNode.removeChild(div);}, 1500);
}