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
            var cleanLayerName = layer.name.toString().replace(/[\"\\\\]/g, "");
            var cleanPropName = prop.name.toString().replace(/[\"\\\\]/g, "");

            // Process all consecutive keyframe pairs
            for (var k = 0; k < keys.length - 1; k++) {
                var keyStart = keys[k];
                var keyEnd = keys[k + 1];

                // Basic values
                var duration = prop.keyTime(keyEnd) - prop.keyTime(keyStart);
                var startVal = prop.keyValue(keyStart);
                var endVal = prop.keyValue(keyEnd);

                // Simple Easing Extract (Avoid complex objects)
                var x1=0.25, y1=0.1, x2=0.25, y2=1.0; // Defaults
                try {
                    if (prop.keyOutInterpolationType(keyStart) == KeyframeInterpolationType.BEZIER) {
                        var outEase = prop.keyOutTemporalEase(keyStart)[0];
                        var inEase = prop.keyInTemporalEase(keyEnd)[0];
                        x1 = outEase.influence / 100;
                        x2 = 1 - inEase.influence / 100;
                    } else if (prop.keyOutInterpolationType(keyStart) == KeyframeInterpolationType.LINEAR) {
                        x1=0; y1=0; x2=1; y2=1;
                    }
                } catch(e) {}

                animations.push('{' +
                    '"id":"anim_' + animations.length + '",' +
                    '"layer":"' + cleanLayerName + '",' +
                    '"property":"' + cleanPropName + ' [' + (keyStart) + '-' + (keyEnd) + ']",' +
                    '"from":' + (startVal instanceof Array ? "["+startVal.join(",")+"]" : startVal) + ',' +
                    '"to":' + (endVal instanceof Array ? "["+endVal.join(",")+"]" : endVal) + ',' +
                    '"delay":' + Math.round(prop.keyTime(keyStart) * 1000) + ',' +
                    '"duration":' + Math.round(duration * 1000) + ',' +
                    '"easing":"cubic-bezier(' + x1.toFixed(3) + ',' + y1.toFixed(3) + ',' + x2.toFixed(3) + ',' + y2.toFixed(3) + ')"' +
                '}');
            }
        }

        if (animations.length === 0) return '{"error": "No valid keyframe pairs selected"}';

        return '[{"id":"trans_' + now + '","title":"' + comp.name.replace(/[\"\\\\]/g, "") + '","animations":[' + animations.join(",") + ']}]';
    } catch (e) {
        return '{"error": "Fatal Script Error: ' + e.toString().replace(/[\"\\\\]/g, "") + '"}';
    }
};