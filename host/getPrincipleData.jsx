$.global.getPrincipleData = function () {
    try {
        if (!app.project.activeItem || !(app.project.activeItem instanceof CompItem)) return '{"error": "No active comp"}';
        var comp = app.project.activeItem;
        var selProps = comp.selectedProperties;
        
        if (selProps.length < 1) return '{"error": "Please select keyframe properties first"}';

        var animations = [];
        var now = new Date().getTime();

        for (var i = 0; i < selProps.length; i++) {
            var prop = selProps[i];
            if (!prop.canVaryOverTime || prop.selectedKeys.length < 2) continue;

            var keys = prop.selectedKeys;
            var layer = prop.propertyGroup(prop.propertyDepth);
            
            // Basic values
            var duration = prop.keyTime(keys[1]) - prop.keyTime(keys[0]);
            var startVal = prop.keyValue(keys[0]);
            var endVal = prop.keyValue(keys[1]);
            
            // Simple Easing Extract (Avoid complex objects)
            var x1=0.25, y1=0.1, x2=0.25, y2=1.0; // Defaults
            try {
                if (prop.keyOutInterpolationType(keys[0]) == KeyframeInterpolationType.BEZIER) {
                    var outEase = prop.keyOutTemporalEase(keys[0])[0];
                    var inEase = prop.keyInTemporalEase(keys[1])[0];
                    x1 = outEase.influence / 100;
                    x2 = 1 - inEase.influence / 100;
                } else if (prop.keyOutInterpolationType(keys[0]) == KeyframeInterpolationType.LINEAR) {
                    x1=0; y1=0; x2=1; y2=1;
                }
            } catch(e) {}

            var cleanLayerName = layer.name.toString().replace(/[\"\\\\]/g, "");
            var cleanPropName = prop.name.toString().replace(/[\"\\\\]/g, "");

            animations.push('{' +
                '"id":"anim_' + i + '",' +
                '"layer":"' + cleanLayerName + '",' +
                '"property":"' + cleanPropName + '",' +
                '"from":' + (startVal instanceof Array ? "["+startVal.join(",")+"]" : startVal) + ',' +
                '"to":' + (endVal instanceof Array ? "["+endVal.join(",")+"]" : endVal) + ',' +
                '"delay":' + Math.round(prop.keyTime(keys[0]) * 1000) + ',' +
                '"duration":' + Math.round(duration * 1000) + ',' +
                '"easing":"cubic-bezier(' + x1.toFixed(3) + ',' + y1.toFixed(3) + ',' + x2.toFixed(3) + ',' + y2.toFixed(3) + ')"' +
            '}');
        }

        if (animations.length === 0) return '{"error": "No valid keyframe pairs selected"}';

        return '[{"id":"trans_' + now + '","title":"' + comp.name.replace(/[\"\\\\]/g, "") + '","animations":[' + animations.join(",") + ']}]';
    } catch (e) {
        return '{"error": "Fatal Script Error: ' + e.toString().replace(/[\"\\\\]/g, "") + '"}';
    }
};