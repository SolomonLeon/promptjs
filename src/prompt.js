var loadPrompt = function (baseNode) {
    var config = {}; // 配置
    config.displayTime = 1690; // 保留时长
    config.shake = true; // 是否晃动
    config.classList = {};

    // 模板
    config.errorModel = document.createElement("div"); // 提示承载DOM
    config.errorModel.classList.add("promptContent"); // 提示承载DOM样式，不可省略
    config.errorModel.appendChild(document.createElement("div")); // 提示DOM
    config.errorModel.children[0].classList.add("promptError"); // 提示样式
    config.classList.error = "promptError"; // 注册提示样式，为switch服务

    config.successModel = document.createElement("div");
    config.successModel.classList.add("promptContent");
    config.successModel.appendChild(document.createElement("div"));
    config.successModel.children[0].classList.add("promptSuccess");
    config.classList.success = "promptSuccess";

    config.warnModel = document.createElement("div");
    config.warnModel.classList.add("promptContent");
    config.warnModel.appendChild(document.createElement("div"));
    config.warnModel.children[0].classList.add("promptWarn");
    config.classList.warn = "promptWarn";

    config.informModel = document.createElement("div");
    config.informModel.classList.add("promptContent");
    config.informModel.appendChild(document.createElement("div"))
    config.informModel.children[0].classList.add("promptInform")
    config.classList.inform = "promptInform";

    var prompt = document.createElement("div"); // 承载提示框的DOM
    prompt.classList.add("prompt");
    if (baseNode == undefined) {
        baseNode = document.body;
    }
    baseNode.appendChild(prompt);
    baseNode = null;

    // 操作
    var throttle = function (func, delay) { // 节流
        var timer = null;
        return function () {
            var context = this;
            var args = arguments;
            if (!timer) {
                timer = setTimeout(function () {
                    func.apply(context, args);
                    timer = null;
                }, delay);
            }
        }
    }

    var resize = function () { // 窗口resize
        for (var i = 0; i < prompt.children.length; i++) {
            prompt.children[i].style.maxHeight = prompt.children[i].scrollHeight + "px";
        }
    }
    window.addEventListener("resize", throttle(resize, 300));

    var displayPrompt = function (node, isKeep) {
        prompt.appendChild(node);
        setTimeout(function () { //显示
            node.classList.add("promptShow");
            node.style.maxHeight = node.scrollHeight + "px";
        }, 0);
        if (isKeep) {
            node.classList.add("promptKeep");
            if (config.shake) {
                node.classList.add("promptShake");
            }
        } else {
            setTimeout(function () {
                remove(node);
            }, config.displayTime);
        }
    }

    var modify = function (node, modifyContent) {
        node.children[0].innerHTML = "";
        if (typeof (modifyContent) == "object") {
            node.children[0].appendChild(modifyContent);
        } else {
            node.children[0].innerHTML = modifyContent;
        }
        node.style.maxHeight = node.scrollHeight + "px";
    }

    var remove = function (node) {
        node.classList.remove("promptShow")
        node.classList.add("promptOut")
        node.style.maxHeight = null;
        setTimeout(function () {
            node.remove()
        }, 1000)
    }

    var clean = function () { // 删除所有prompt
        for (var i = 0; i < prompt.children.length; i++) {
            remove(prompt.children[i])
        }
    }

    var keepOperater = function (node) {
        return {
            "node": node,
            "remove": function () {
                remove(node)
            },
            "modify": function (content) {
                modify(node, content)
            },
            "switch": function (type) {
                if (type in config.classList) {
                    for (var i in config.classList) {
                        node.children[0].classList.remove(config.classList[i]);
                    }
                    node.children[0].classList.add(config.classList[type]);
                } else {
                    console.error("Prompt: Not support type " + type.toString())
                }
            },
            "noShake": function () {
                node.classList.remove("promptShake");
            },
            "click": function (handle) {
                node.classList.remove("promptShake");
                node.classList.add("promptClick");
                node.addEventListener("click", handle)
            }
        }
    }

    // 不同的prompt
    var error = function (content, isKeep) {
        var errorNode = config.errorModel.cloneNode(true);
        modify(errorNode, content);
        displayPrompt(errorNode, isKeep);
        if (isKeep) {
            return keepOperater(errorNode)
        }
    }
    var success = function (content, isKeep) {
        var successNode = config.successModel.cloneNode(true);
        modify(successNode, content);
        displayPrompt(successNode, isKeep);
        if (isKeep) {
            return keepOperater(successNode)
        }
    }
    var warn = function (content, isKeep) {
        var warnNode = config.warnModel.cloneNode(true);
        modify(warnNode, content);
        displayPrompt(warnNode, isKeep);
        if (isKeep) {
            return keepOperater(warnNode)
        }
    }
    var inform = function (content, isKeep) {
        var informNode = config.informModel.cloneNode(true);
        modify(informNode, content)
        displayPrompt(informNode, isKeep)
        if (isKeep) {
            return keepOperater(informNode)
        }
    }
    var pFuncs = {}; // 功能列表
    pFuncs["config"] = config;
    pFuncs["clean"] = clean;
    pFuncs["error"] = error;
    pFuncs["success"] = success;
    pFuncs["inform"] = inform;
    pFuncs["warn"] = warn;
    return pFuncs;

}
