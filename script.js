function nextCommentWrap(i, original, up) {
	return function() {nextComment(i, original, up);};
}

var nodeList = document.querySelectorAll(".commentarea > .sitetable > .comment");
for (var i = 0; i < nodeList.length; i++) {
	var node = nodeList[i];
	node.setAttribute("data-comment", i);
	preencher(node, i);
	appendLink(node);
	var childList = node.querySelectorAll(".comment");
	for (var j = 0; j < childList.length; j++) {
		var child = childList[j];
		appendLink(child);
		appendLink(child, 1);
	}
}

function appendLink(node, up) {
	var p = node.querySelector("p.tagline");
	var data = node.getAttribute("data-comment");
	var link = document.createElement('a');
	link.href = "javascript:void(0)";
	link.onclick = nextCommentWrap(data, "", up);
	link.innerHTML = "proximo";
	p.appendChild(link);
}

function nextComment(data, original, up) {
	if (!original) {
		original = data;
	}
	console.log("atual: " + data);
	var split = data.split(".");
	if (up) {
		split.splice(-1, 1);
	}
	var next;
	if (split.length > 0) {
		next = parseInt(split[split.length-1],10);
		next++;
		split.splice(-1, 1, next);
	}
	data = split.join(".");
	console.log("proximo: " + data);
	var selector = '[data-comment="' + data + '"]';
	var node = document.querySelector(selector);
	if (!node){
		console.log("nao existe");
		if (split.length > 0) {
			nextComment(data, original, 1);
		} else {
			insertDiv("Não existe");
		}
	} else {
		node.scrollIntoView();
		insertDiv(original + " > " + data);
	}
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