/**
 * LeeSinMotion CEP Host - v3.5.4 Exact Source Port
 * Include Fix: Anchor Point detection robustness
 */
var scriptVersion = "3.5.4";
var thisComp;

// ==========================================
// Easing Library
// ==========================================
var easeLib = {
    "Default (默认)": [0.25, 0.1, 0.25, 1.0],
    "EaseOut (缓出)": [0.0, 0.0, 0.58, 1.0],
    "EaseIn (缓入)": [0.42, 0.0, 1.0, 1.0],
    "EaseInEaseOut (缓入缓出)": [0.42, 0.0, 0.58, 1.0],
    "Linear (线性)": [0.0, 0.0, 1.0, 1.0],
    "Emphasized Decelerate (强调减速)": [0.05, 0.7, 0.1, 1.0],
    "Emphasized Accelerate (强调加速)": [0.3, 0.0, 0.8, 0.15],
    "Standard (标准)": [0.2, 0.0, 0.0, 1.0],
    "Standard Decelerate (标准减速)": [0.0, 0.0, 0.0, 1.0],
    "Standard Accelerate (标准加速)": [0.3, 0.0, 1.0, 1.0],
    "Hold": [0.0, 0.0, 0.0, 0.0]
};

// ==========================================
// Utilities
// ==========================================
function setComp() {
    thisComp = app.project.activeItem;
    return (thisComp && thisComp instanceof CompItem);
}

function timeToMs(time) { return Math.round(time * 1000) + 'ms'; }

function round(value, opt_decimals) {
    try {
        var decimals = opt_decimals || 2;
        return parseFloat(value.toFixed(decimals));
    } catch (e) {
        return value;
    }
}

function capitalizeFirstLetter(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ==========================================
// Core Extraction Logic
// ==========================================

function getSelKeys() {
    try {
        var selKeyList = [];
        var props = thisComp.selectedProperties;
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (!prop.canVaryOverTime) continue;
            var selKeys = prop.selectedKeys;
            if (selKeys.length < 2) continue;
            selKeyList.push({ prop: prop, keys: selKeys });
        }
        return selKeyList;
    } catch (error) { return []; }
}

function getKeyRange() {
    var selKeys = getSelKeys();
    if (selKeys.length < 1) { return [thisComp.time, thisComp.time + 1]; }
    else {
        var firstKeyTime = 9999999;
        var lastKeyTime = -9999999;
        for (var i = 0; i < selKeys.length; i++) {
            var actKey = selKeys[i];
            var prop = actKey.prop;
            var keys = actKey.keys;
            for (var j = 0; j < keys.length; j++) {
                var keyTime = prop.keyTime(keys[j]);
                firstKeyTime = Math.min(firstKeyTime, keyTime);
                lastKeyTime = Math.max(lastKeyTime, keyTime);
            }
        }
        return [firstKeyTime, lastKeyTime];
    }
}

function getPropSpec(actKey) {
    var prop = actKey.prop;
    var keys = actKey.keys;
    var duration = prop.keyTime(keys[1]) - prop.keyTime(keys[0]);

    var valChange = { matchName: prop.matchName, start: null, end: null };
    if (prop.propertyValueType !== PropertyValueType.NO_VALUE) {
        valChange.start = prop.keyValue(keys[0]);
        valChange.end = prop.keyValue(keys[1]);
    }
    if (prop.matchName.match(/Shape/)) { valChange.start = null; valChange.end = null; }

    var layer = prop.propertyGroup(prop.propertyDepth);
    if (!layer.threeDLayer && valChange.start instanceof Array && valChange.start.length > 2) {
        try { valChange.start = valChange.start.slice(0, 2); valChange.end = valChange.end.slice(0, 2); } catch (e) { }
    }

    var startVal, endVal;
    try { startVal = prop.keyValue(keys[0]); endVal = prop.keyValue(keys[1]); } catch (e) { startVal = 0; endVal = 1; }

    var x1 = 5, y1 = 5, x2 = 5, y2 = 5;

    if (prop.keyOutInterpolationType(keys[0]) == KeyframeInterpolationType.LINEAR &&
        prop.keyInInterpolationType(keys[1]) == KeyframeInterpolationType.LINEAR) {
        x1 = 0; y1 = 0; x2 = 1; y2 = 1;
    } else if (prop.keyOutInterpolationType(keys[0]) == KeyframeInterpolationType.HOLD) {
        x1 = 0; y1 = 0; x2 = 0; y2 = 0;
    } else {
        var change;
        if (startVal instanceof Array && startVal.length > 1) {
            if (prop.matchName.split('Size').length > 1 || prop.matchName.split('Scale').length > 1) {
                change = endVal[0] - startVal[0];
            } else {
                change = Math.sqrt(Math.pow(endVal[0] - startVal[0], 2) + Math.pow(endVal[1] - startVal[1], 2));
            }
        } else {
            if (isNaN(endVal)) change = 1;
            else change = endVal - startVal;
        }

        var startOutEase = prop.keyOutTemporalEase(keys[0])[0];
        var endInEase = prop.keyInTemporalEase(keys[1])[0];
        var keyOutSpeed = startOutEase.speed;
        var keyInSpeed = endInEase.speed;

        x1 = startOutEase.influence / 100;
        y1 = (keyOutSpeed * x1) * (duration / (change || 0.0000000001));
        x2 = 1 - endInEase.influence / 100;
        y2 = 1 + (keyInSpeed * (x2 - 1)) * (duration / (change || 0.0000000001));

        // Safety clamps from source or common sense
        // Source lines 773-775:
        // if (Math.abs(y1) < 0.01) y1 = 0;
        // if (Math.abs(y2 - 1) < 0.01) y2 = 1;
        // if (Math.abs(y2) < 0.01) y2 = 0;
        if (Math.abs(y1) < 0.01) y1 = 0;
        if (Math.abs(y2 - 1) < 0.01) y2 = 1;
        if (Math.abs(y2) < 0.01) y2 = 0;

        if (prop.keyOutInterpolationType(keys[0]) == KeyframeInterpolationType.LINEAR) {
            x1 = 0.17; y1 = 0.17;
        } else if (prop.keyInInterpolationType(keys[1]) == KeyframeInterpolationType.LINEAR) {
            x2 = 0.83; y2 = 0.83;
        }
    }

    return {
        value: valChange,
        duration: duration,
        ease: [x1, y1, x2, y2],
        delay: prop.keyTime(keys[0])
    };
}

// ==========================================
// Anchor Logic Helper
// ==========================================
function getAnchorLabel(layerObj) {
    if (!layerObj) return null;
    try {
        // Try/Catch block around sourceRectAtTime is crucial
        var rect;
        try {
            rect = layerObj.sourceRectAtTime(thisComp.time, false);
        } catch (e) { return null; } // Fails for cameras/lights etc

        var apVal = layerObj.anchorPoint.value;
        var w = rect.width; var h = rect.height;
        var ax = apVal[0] - rect.left;
        var ay = apVal[1] - rect.top;
        var tol = 2;
        var apLabel = "";

        var isL = Math.abs(ax) < tol;
        var isC = Math.abs(ax - w / 2) < tol;
        var isR = Math.abs(ax - w) < tol;
        var isT = Math.abs(ay) < tol;
        var isM = Math.abs(ay - h / 2) < tol;
        var isB = Math.abs(ay - h) < tol;

        if (isT && isL) apLabel = "Top-Left (左上)";
        else if (isT && isC) apLabel = "Top-Center (中上)";
        else if (isT && isR) apLabel = "Top-Right (右上)";
        else if (isM && isL) apLabel = "Middle-Left (左中)";
        else if (isM && isC) apLabel = "Center (居中)";
        else if (isM && isR) apLabel = "Middle-Right (右中)";
        else if (isB && isL) apLabel = "Bottom-Left (左下)";
        else if (isB && isC) apLabel = "Bottom-Center (中下)";
        else if (isB && isR) apLabel = "Bottom-Right (右下)";
        else apLabel = "Custom (" + round(apVal[0]) + ", " + round(apVal[1]) + ")";

        return apLabel;
    } catch (e) { return null; }
}


// ==========================================
// Formatting Logic
// ==========================================

function getCubic(arr) {
    var val = '';
    var tokenMatch = null;
    var tolerance = 0.05;

    for (var key in easeLib) {
        if (easeLib.hasOwnProperty(key)) {
            var cubicBez = easeLib[key];
            var match = true;
            for (var i = 0; i < 4; i++) {
                if (Math.abs(cubicBez[i] - arr[i]) > tolerance) { match = false; break; }
            }
            if (match) { tokenMatch = { name: key, cubic: cubicBez }; break; }
        }
    }

    function f(n) { return n.toFixed(2); }

    if (tokenMatch) {
        var c = tokenMatch.cubic;
        val = tokenMatch.name + ": (" + f(c[0]) + ", " + f(c[1]) + ", " + f(c[2]) + ", " + f(c[3]) + ")";
    } else {
        val = "(" + f(arr[0]) + ", " + f(arr[1]) + ", " + f(arr[2]) + ", " + f(arr[3]) + ")";
    }
    return val;
}

function getVal(valObj) {
    var str = '';
    var labels = ['X', 'Y', 'Z', 'W'];
    var isPosition = valObj.matchName.match(/Position/) != null;
    var isAnchor = valObj.matchName.match(/Anchor/) != null;

    var formatSingle = function (start, end, unit, showDelta, axisIndex) {
        if (unit === undefined) unit = '';
        if (showDelta === undefined) showDelta = true;
        if (axisIndex === undefined) axisIndex = -1;

        var s = round(start);
        var e = round(end);
        var roundedDelta = Math.round(end - start);

        if (roundedDelta === 0) return null;

        var deltaStr = '';
        if (showDelta) {
            if ((isPosition || isAnchor) && axisIndex >= 0) {
                var arrow = '';
                if (axisIndex === 0) {
                    if (isPosition) arrow = roundedDelta > 0 ? ' →' : ' ←';
                    if (isAnchor) arrow = roundedDelta > 0 ? ' ←' : ' →';
                }
                if (axisIndex === 1) {
                    if (isPosition) arrow = roundedDelta > 0 ? ' ↓' : ' ↑';
                    if (isAnchor) arrow = roundedDelta > 0 ? ' ↑' : ' ↓';
                }
                deltaStr = " (" + Math.abs(roundedDelta) + unit + arrow + ")";
            } else {
                deltaStr = " (" + Math.abs(roundedDelta) + unit + ")";
            }
        }
        return s + " → " + e + unit + deltaStr;
    };

    var isScale = valObj.matchName.match(/Scale/i) != null;
    var toVal = function (v) { return v; };
    var unit = (isScale || valObj.matchName.match(/Opacity/i)) ? '%' : ((isPosition || isAnchor) ? 'px' : (valObj.matchName.match(/Rotate|Angle/i) ? 'º' : ''));

    if (valObj.matchName.match(/Color/i) != null) {
        return "Color Change";
    } else if (valObj.matchName.match(/Shape/i) != null) {
        return '';
    } else if (valObj.start instanceof Array && valObj.start.length > 1) {
        var isUniform = true;
        for (var i = 1; i < valObj.start.length; i++) {
            if (Math.abs(valObj.start[i] - valObj.start[0]) > 0.01 || Math.abs(valObj.end[i] - valObj.end[0]) > 0.01) {
                isUniform = false;
                break;
            }
        }
        if (isUniform) {
            str = formatSingle(toVal(valObj.start[0]), toVal(valObj.end[0]), unit, true, (isPosition || isAnchor) ? 0 : -1) || '';
        } else {
            var parts = [];
            for (var i = 0; i < valObj.start.length; i++) {
                var res = formatSingle(toVal(valObj.start[i]), toVal(valObj.end[i]), unit, true, (isPosition || isAnchor) ? i : -1);
                if (res) parts.push(labels[i] + ": " + res);
            }
            str = parts.length > 0 ? ('\n  ' + parts.join('\n  ')) : '';
        }
    } else {
        var axisIdx = -1;
        if (isPosition || isAnchor) {
            if (valObj.matchName.match(/_0|X/)) axisIdx = 0;
            else if (valObj.matchName.match(/_1|Y/)) axisIdx = 1;
            else if (valObj.matchName.match(/_2|Z/)) axisIdx = 2;
            else axisIdx = 0;
        }
        str = formatSingle(toVal(valObj.start), toVal(valObj.end), unit, true, axisIdx) || '';
    }
    return str;
}


function parseSpecText(specObj, markdown) {
    if (!specObj) return '';
    var lineBreak = (markdown) ? '\n\n' : '\n';
    var h1 = (markdown) ? '# ' : '';
    var h2 = (markdown) ? '## ' : '\n';
    var propLine = (markdown) ? '\n    ' : '\n  ';

    var str = '';
    str = h1 + specObj.compName;
    str += lineBreak;
    if (specObj.totalDur) str += "Total duration: " + timeToMs(specObj.totalDur) + "\n";

    for (var i = 0; i < specObj.layers.length; i++) {
        var layer = specObj.layers[i];
        str += (markdown) ? '\n' : '';
        var prefix = (layer.index) ? "Layer " + layer.index + " - " : "";
        str += h2 + prefix + layer.name;
        if (layer.anchorPoint) {
            str += '\n';
            str += (markdown) ? "Anchor: " + layer.anchorPoint : "[Anchor: " + layer.anchorPoint + "]";
        }

        for (var j = 0; j < layer.props.length; j++) {
            var prop = layer.props[j];
            var val = getVal(prop.value);
            if (!val || val === '' || val === ' ') continue;

            str += "\n- " + prop.name;
            if (val.indexOf('\n') === 0) str += val; // If val starts with newline, just append
            else str += "\n  " + val; // If val is inline, force a newline with indentation
            str += propLine + "Start: " + timeToMs(prop.delay);
            str += propLine + "Duration: " + timeToMs(prop.duration);
            str += propLine + getCubic(prop.ease) + "\n";
        }
    }
    return str;
}

// ==========================================
// EXPOSED API
// ==========================================

$.global.getKeysSpec = function () {
    try {
        if (!setComp()) return "请打开一个合成";
        var selProps = thisComp.selectedProperties;
        if (selProps.length < 1) return "请选中关键帧属性";

        var spec = { compName: thisComp.name, totalDur: 0, layers: [] };
        var keyRange = getKeyRange();
        spec.totalDur = keyRange[1] - keyRange[0];

        var selKeys = getSelKeys(); // [{prop, keys:[]}, ...]
        if (selKeys.length < 1) return "请先在时间轴中选择两个关键帧";

        var activeLayer = null;

        for (var i = 0; i < selKeys.length; i++) {
            var actKey = selKeys[i];
            var prop = actKey.prop;
            var keys = actKey.keys;
            var layer = prop.propertyGroup(prop.propertyDepth);

            if (activeLayer != layer) {
                activeLayer = layer;
                spec.layers.push({
                    name: layer.name,
                    _layerObj: layer, // Hack: Storing reference to real layer object for anchor lookup
                    props: []
                });
            }

            // Source restriction: Only first pair
            var propSpec = getPropSpec({ prop: prop, keys: [keys[0], keys[1]] });

            var nameOverride = null;
            if (prop.matchName.match(/Control/) != null) nameOverride = prop.propertyGroup(1).name;

            spec.layers[spec.layers.length - 1].props.push({
                name: nameOverride || prop.name,
                value: propSpec.value,
                duration: propSpec.duration,
                ease: propSpec.ease,
                delay: propSpec.delay
            });
        }

        // Anchor Logic using stored layer reference - Much more robust
        for (var x = 0; x < spec.layers.length; x++) {
            var l = spec.layers[x];
            // Use our stored reference if available, fallback to name search
            var layerObj = l._layerObj;
            if (!layerObj) {
                for (var L = 1; L <= thisComp.numLayers; L++) {
                    if (thisComp.layer(L).name === l.name) { layerObj = thisComp.layer(L); break; }
                }
            }
            if (layerObj) {
                var label = getAnchorLabel(layerObj);
                if (label) l.anchorPoint = label;
            }
            delete l._layerObj; // Clean up before sending to JSON parser if we were using JSON
        }

        return parseSpecText(spec, false);
    } catch (e) { return "Error: " + e.toString(); }
};

$.global.getSingleKeySpec = function () {
    try {
        if (!setComp()) return "请打开一个合成";
        var props = thisComp.selectedProperties;
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (!prop.canVaryOverTime) continue;
            var selKeys = prop.selectedKeys;
            if (selKeys.length === 1) {
                var layer = prop.propertyGroup(prop.propertyDepth);
                var t = prop.keyTime(selKeys[0]);
                return "[" + layer.name + "] " + prop.name + ": " + timeToMs(t);
            }
        }
        return "请选中一个关键帧";
    } catch (e) { return "Error: " + e.toString(); }
}

function scanLayer(layer, silent) {
    var layerSpec = { name: layer.name, index: layer.index, props: [] };

    function crawlProps(group) {
        for (var i = 1; i <= group.numProperties; i++) {
            var prop = group.property(i);
            if (prop.propertyType === PropertyType.PROPERTY) {
                if (prop.canVaryOverTime && prop.numKeys > 1) {
                    for (var k = 1; k < prop.numKeys; k++) {
                        var actKey = { prop: prop, keys: [k, k + 1] };
                        var propSpec = getPropSpec(actKey);
                        var nameOverride = null;
                        if (prop.matchName.match(/Control/) != null) nameOverride = prop.propertyGroup(1).name;

                        layerSpec.props.push({
                            name: (nameOverride || prop.name) + " [" + k + "-" + (k + 1) + "]",
                            value: propSpec.value,
                            duration: propSpec.duration,
                            ease: propSpec.ease,
                            delay: prop.keyTime(k)
                        });
                    }
                }
            } else if (prop.propertyType === PropertyType.INDEXED_GROUP || prop.propertyType === PropertyType.NAMED_GROUP) {
                crawlProps(prop);
            }
        }
    }
    crawlProps(layer);

    var apLabel = getAnchorLabel(layer);
    if (apLabel) layerSpec.anchorPoint = apLabel;

    layerSpec.props.sort(function (a, b) { return a.delay - b.delay; });
    return layerSpec;
}

$.global.getLayerSpec = function () {
    try {
        if (!setComp()) return "请打开一个合成";
        if (thisComp.selectedLayers.length === 0) return "请先选择一个图层";
        var layer = thisComp.selectedLayers[0];
        var layerData = scanLayer(layer);
        if (!layerData || layerData.props.length === 0) return "该图层没有关键帧";

        var spec = {
            compName: thisComp.name,
            totalDur: thisComp.workAreaDuration,
            layers: [layerData]
        };
        return parseSpecText(spec, false);
    } catch (e) { return "Error: " + e.toString(); }
}

$.global.getCompSpec = function () {
    try {
        if (!setComp()) return "请打开一个合成";
        var allLayerSpecs = [];
        for (var i = 1; i <= thisComp.numLayers; i++) {
            var layer = thisComp.layer(i);
            var layerData = scanLayer(layer, true);
            if (layerData && layerData.props.length > 0) {
                var earliest = 999999;
                for (var j = 0; j < layerData.props.length; j++) earliest = Math.min(earliest, layerData.props[j].delay);
                allLayerSpecs.push({ data: layerData, startTime: earliest });
            }
        }
        if (allLayerSpecs.length === 0) return "合成中没有找到任何关键帧数据";
        // allLayerSpecs.sort(function (a, b) { return a.startTime - b.startTime; }); // REMOVED: Keep layer order

        var spec = {
            compName: thisComp.name + " (全合成动效剧本)",
            totalDur: thisComp.workAreaDuration,
            layers: []
        };
        for (var k = 0; k < allLayerSpecs.length; k++) spec.layers.push(allLayerSpecs[k].data);
        return parseSpecText(spec, false);
    } catch (e) { return "Error: " + e.toString(); }
}

// ==========================================
// Footer Functions Ported from v3.5.4
// ==========================================

var exp_counter = "var sTime = marker.key(\"Start\").time; var eTime = marker.key(\"End\").time; var countTime = Math.max(time - sTime, 0); countTime = Math.min(countTime, eTime - sTime); var counter = Math.round(countTime * 1000); var playIcon = (time > sTime && time < eTime) ? \"► \" : \"■ \"; playIcon + counter + \"ms\";";
var configFolder = Folder.userData.toString() + "/BattleAxe/LeeSinMotion/config/";

function setTimeMarkers(layer, startTime, endTime) {
    var layer_marker1 = new MarkerValue("Start");
    layer_marker1.eventCuePoint = true;
    layer.property("ADBE Marker").setValueAtTime(startTime, layer_marker1);

    var layer_marker2 = new MarkerValue("End");
    layer_marker2.eventCuePoint = true;
    layer.property("ADBE Marker").setValueAtTime(endTime, layer_marker2);
}

$.global.buildCounter = function () {
    try {
        if (!setComp()) return "请打开一个合成";
        var keyRange = getKeyRange();

        app.beginUndoGroup("New Counter");

        var dynText = thisComp.layers.addText("Counter");
        dynText.name = "Counter";
        dynText.comment = "LeeSinMotion_data";
        dynText.guideLayer = true;

        var dynText_TextProp = dynText.property("ADBE Text Properties").property("ADBE Text Document");
        var dynText_TextDocument = dynText_TextProp.value;
        dynText_TextDocument.resetCharStyle();
        dynText_TextDocument.fontSize = thisComp.width / 30;
        dynText_TextDocument.font = "CourierNewPS-BoldMT";
        dynText_TextDocument.fillColor = [0.5, 0.5, 0.5];
        dynText_TextDocument.applyStroke = false;
        dynText_TextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
        dynText_TextDocument.tracking = -30;

        if (parseFloat(app.version) >= 13.2) {
            dynText_TextDocument.verticalScale = 1;
            dynText_TextDocument.horizontalScale = 1;
            dynText_TextDocument.baselineShift = 0;
            dynText_TextDocument.tsume = 0;
        }

        dynText_TextProp.setValue(dynText_TextDocument);
        dynText_TextProp.setValue("►");

        var manualLineHeight = 10;
        var lineHeight = dynText.property("ADBE Text Properties").property(4).addProperty("ADBE Text Animator"); // 4 is typical index, but safer to use matchName
        // Wait, property(4) is risky. Let"s use matchNames if possible or trust source.
        // Source used property(4). I will trust source.
        lineHeight.name = "Line Height";
        lineHeight.property("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");
        lineHeight.property(1).addProperty("ADBE Text Selector");
        lineHeight.property(2).property("ADBE Text Line Spacing").setValue([0, manualLineHeight]);

        dynText.property("ADBE Transform Group").property("ADBE Position").setValue([100, 100]);

        setTimeMarkers(dynText, keyRange[0], keyRange[1]);
        dynText.property("ADBE Text Properties").property("ADBE Text Document").expression = exp_counter;

        app.endUndoGroup();
        return "计数器已创建";
    } catch (e) { return "Error: " + e.toString(); }
};

$.global.openSettings = function () {
    var f = new Folder(configFolder);
    if (!f.exists) f.create();
    f.execute();
    return "Settings opened";
};

