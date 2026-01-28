/**
 * LeeSinMotion CEP Host Engine - v3.5.4 (Complete)
 */

// ==========================================
// UTILITIES
// ==========================================

function round(num) {
    if (typeof num !== 'number') return num;
    var rounded = num.toFixed(2);
    return rounded === '-0.00' ? '0.00' : rounded;
}

function timeToMs(time) {
    return Math.round(time * 1000) + "ms";
}

function setComp() {
    thisComp = app.project.activeItem;
    return (thisComp && thisComp instanceof CompItem);
}

// ==========================================
// CORE EXPORTS
// ==========================================

// 1. 获取选中的关键帧数据 (JSON)
$.global.getKeysSpec = function () {
    try {
        if (!setComp()) return JSON.stringify({ error: "请打开一个合成" });

        var thisComp = app.project.activeItem;
        var selProps = thisComp.selectedProperties;

        if (!selProps || selProps.length === 0) return JSON.stringify({ error: "请先选中关键帧属性" });

        var spec = {
            compName: thisComp.name,
            totalDur: 0,
            layers: []
        };

        var activeLayer = null;
        for (var i = 0; i < selProps.length; i++) {
            var prop = selProps[i];
            if (prop.canVaryOverTime && prop.selectedKeys.length > 1) {
                var layer = prop.propertyGroup(prop.propertyDepth);
                if (activeLayer !== layer) {
                    activeLayer = layer;
                    spec.layers.push({ name: layer.name, props: [] });
                }

                var keys = prop.selectedKeys;
                var duration = prop.keyTime(keys[keys.length - 1]) - prop.keyTime(keys[0]);

                spec.layers[spec.layers.length - 1].props.push({
                    name: prop.name,
                    value: {
                        start: prop.keyValue(keys[0]),
                        end: prop.keyValue(keys[keys.length - 1])
                    },
                    duration: Math.round(duration * 1000),
                    delay: prop.keyTime(keys[0]),
                    ease: [0.4, 0, 0.2, 1] // Keep it simple for now
                });
            }
        }
        return JSON.stringify(spec);
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

// 2. 获取全合成数据 (JSON)
$.global.getCompSpecJSON = function () {
    try {
        if (!setComp()) return JSON.stringify({ error: "No Active Comp" });
        var thisComp = app.project.activeItem;

        var spec = {
            compName: thisComp.name,
            totalDur: thisComp.workAreaDuration,
            layers: []
        };

        for (var i = 1; i <= thisComp.numLayers; i++) {
            var layer = thisComp.layer(i);
            if (!layer.enabled) continue;

            var layerData = {
                name: layer.name,
                props: []
            };

            // Simplified scan for Transform properties
            var transform = layer.transform;
            if (transform) {
                var propsToCheck = ["Position", "Scale", "Rotation", "Opacity"];
                for (var p = 0; p < propsToCheck.length; p++) {
                    var pName = propsToCheck[p];
                    if (transform[pName] && transform[pName].numKeys > 1) {
                        var prop = transform[pName];
                        // Just take the first segment as a sample
                        layerData.props.push({
                            name: pName,
                            duration: Math.round((prop.keyTime(2) - prop.keyTime(1)) * 1000),
                            delay: prop.keyTime(1),
                            ease: [0.17, 0.17, 0.83, 0.83]
                        });
                    }
                }
            }

            if (layerData.props.length > 0) {
                spec.layers.push(layerData);
            }
        }
        return JSON.stringify(spec);
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

// 3. 获取系统元数据（专门用于修复路径报错）
$.global.getMetaInfo = function () {
    try {
        var desktopPath = Folder.desktop.fsName;
        var os = $.os.indexOf("Windows") !== -1 ? "Windows" : "Mac";
        var sep = os === "Windows" ? "\\" : "/";

        return JSON.stringify({
            desktop: desktopPath,
            separator: sep,
            os: os
        });
    } catch (e) {
        return JSON.stringify({ error: "Meta info failed: " + e.toString() });
    }
};
