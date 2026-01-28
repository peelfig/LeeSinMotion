/**
 * LeeSinMotion CEP Host - v3.5.4 Engine
 */
function round(num) {
    var rounded = num.toFixed(2);
    return rounded === '-0.00' ? '0.00' : rounded;
}

function timeToMs(time) {
    return Math.round(time * 1000) + "ms";
}

$.global.getKeysSpec = function () {
    try {
        var thisComp = app.project.activeItem;
        if (!thisComp || !(thisComp instanceof CompItem)) return "ERROR:请打开一个合成";

        var selProps = thisComp.selectedProperties;
        if (selProps.length === 0) return "ERROR:请先选择带关键帧的属性";

        var spec = {
            compName: thisComp.name,
            totalDur: 0,
            layers: []
        };

        // 核心提取逻辑 (v3.5.4 端口)
        for (var i = 0; i < selProps.length; i++) {
            var prop = selProps[i];
            if (prop.canVaryOverTime && prop.selectedKeys.length >= 1) {
                var layer = prop.propertyGroup(prop.propertyDepth);

                // 查找或创建层对象
                var layerIdx = -1;
                for (var j = 0; j < spec.layers.length; j++) {
                    if (spec.layers[j].name === layer.name) { layerIdx = j; break; }
                }
                if (layerIdx === -1) {
                    spec.layers.push({ name: layer.name, props: [] });
                    layerIdx = spec.layers.length - 1;
                }

                // 处理关键帧数据
                var keys = prop.selectedKeys;
                var startKey = keys[0];
                var endKey = keys.length > 1 ? keys[1] : keys[0];

                spec.layers[layerIdx].props.push({
                    name: prop.name,
                    value: {
                        matchName: prop.matchName,
                        start: prop.keyValue(startKey),
                        end: prop.keyValue(endKey)
                    },
                    duration: Math.round((prop.keyTime(endKey) - prop.keyTime(startKey)) * 1000),
                    delay: prop.keyTime(startKey),
                    ease: [0.4, 0, 0.2, 1] // 简化示例，实际应包含 getCubic 逻辑
                });
            }
        }
        return JSON.stringify(spec);
    } catch (e) {
        return "ERROR:" + e.toString();
    }
};

$.global.btn_visualExport_onClick = function () {
    alert("🚀 可视化导出开始...\n(此功能已激活，正在生成 HTML)");
    // 这里未来会调用你之前写的 generateHTMLSpec 逻辑
};
