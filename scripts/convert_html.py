#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import json
import html

# 读取原始HTML文件
with open('/Users/panspro/Desktop/LeeSin_Export_1774241459218.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取pre标签中的文本数据
pre_match = re.search(r'<pre id="leesin-data">(.*?)</pre>', content, re.DOTALL)
animation_data = pre_match.group(1) if pre_match else ""

# 提取script标签中的JSON数据
script_match = re.search(r'<script id="leesin-thumbnails" type="application/json">(.*?)</script>', content, re.DOTALL)
thumbnails_json = script_match.group(1) if script_match else "{}"

# 解析动画数据，提取参数
def parse_animation_data(text):
    lines = text.strip().split('\n')
    params = []
    current_layer = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # 检测Layer
        if line.startswith('Layer'):
            current_layer = line
        # 检测属性变化
        elif '→' in line or ':' in line:
            params.append({
                'layer': current_layer,
                'property': line
            })

    return params

params = parse_animation_data(animation_data)

# 生成新的HTML
html_template = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>LeeSin Motion Export - 双栏视图</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            background: #1e1e1e;
            color: #d4d4d4;
            height: 100vh;
            overflow: hidden;
        }
        .header {
            padding: 1rem 2rem;
            background: #252526;
            border-bottom: 1px solid #333;
            color: #888;
            font-size: 12px;
        }
        .header span { color: #569cd6; }
        .container {
            display: flex;
            height: calc(100vh - 50px);
        }
        .left-panel {
            flex: 1;
            overflow-y: auto;
            border-right: 1px solid #333;
            padding: 2rem;
        }
        .right-panel {
            flex: 1;
            overflow-y: auto;
            padding: 2rem;
        }
        .section-title {
            color: #4ec9b0;
            font-size: 16px;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #333;
        }
        .param-block {
            background: #252526;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #333;
        }
        .param-layer {
            color: #dcdcaa;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .param-property {
            color: #ce9178;
            margin-left: 1rem;
            line-height: 1.6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #252526;
            border-radius: 8px;
            overflow: hidden;
        }
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #333;
        }
        th {
            background: #2d2d30;
            color: #4ec9b0;
            font-weight: bold;
        }
        tr:hover {
            background: #2d2d30;
        }
        .thumbnail {
            max-width: 100px;
            max-height: 60px;
            border-radius: 4px;
            cursor: pointer;
        }
        .thumbnail:hover {
            opacity: 0.8;
        }
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: #1e1e1e;
        }
        ::-webkit-scrollbar-thumb {
            background: #424242;
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #4e4e4e;
        }
    </style>
</head>
<body>
    <div class="header">LeeSinMotion v4.0.0 Export · <span>双栏视图</span></div>
    <div class="container">
        <div class="left-panel">
            <div class="section-title">识别的参数（当前参数）</div>
            <div id="params-container"></div>
        </div>
        <div class="right-panel">
            <div class="section-title">参数表格</div>
            <table id="params-table">
                <thead>
                    <tr>
                        <th>图层</th>
                        <th>属性</th>
                        <th>起始值</th>
                        <th>结束值</th>
                        <th>时长</th>
                        <th>缓动</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>
        </div>
    </div>

    <script id="animation-data" type="application/json">''' + json.dumps(animation_data, ensure_ascii=False) + '''</script>
    <script id="thumbnails-data" type="application/json">''' + thumbnails_json + '''</script>

    <script>
        // 解析动画数据
        const animationText = document.getElementById('animation-data').textContent;
        const thumbnails = JSON.parse(document.getElementById('thumbnails-data').textContent);

        function parseAnimationData(text) {
            const lines = text.split('\\n');
            const params = [];
            let currentLayer = null;
            let currentProperty = null;

            for (let line of lines) {
                line = line.trim();
                if (!line) continue;

                // 检测Layer
                if (line.startsWith('Layer')) {
                    currentLayer = line;
                }
                // 检测属性名称（如"- 位置"、"- 不透明度"）
                else if (line.startsWith('- ')) {
                    currentProperty = line.substring(2);
                }
                // 检测属性值变化
                else if (line.includes('→')) {
                    const match = line.match(/(.+?)\\s*→\\s*(.+)/);
                    if (match && currentLayer) {
                        params.push({
                            layer: currentLayer,
                            property: currentProperty || '未知属性',
                            startValue: match[1].trim(),
                            endValue: match[2].trim(),
                            duration: '',
                            easing: ''
                        });
                    }
                }
                // 检测Duration
                else if (line.includes('Duration:')) {
                    const match = line.match(/Duration:\\s*(.+)/);
                    if (match && params.length > 0) {
                        params[params.length - 1].duration = match[1].trim();
                    }
                }
                // 检测缓动函数
                else if (line.includes('(') && line.includes(')') && line.includes(',')) {
                    if (params.length > 0) {
                        params[params.length - 1].easing = line;
                    }
                }
            }

            return params;
        }

        const params = parseAnimationData(animationText);

        // 渲染左侧参数面板
        const paramsContainer = document.getElementById('params-container');
        let lastLayer = null;
        params.forEach(param => {
            if (param.layer !== lastLayer) {
                const block = document.createElement('div');
                block.className = 'param-block';
                block.innerHTML = '<div class="param-layer">' + param.layer + '</div>';
                paramsContainer.appendChild(block);
                lastLayer = param.layer;
            }
            const propDiv = document.createElement('div');
            propDiv.className = 'param-property';
            propDiv.textContent = param.property + ': ' + param.startValue + ' → ' + param.endValue;
            paramsContainer.lastChild.appendChild(propDiv);
        });

        // 渲染右侧表格
        const tableBody = document.getElementById('table-body');
        params.forEach(param => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${param.layer}</td>
                <td>${param.property}</td>
                <td>${param.startValue}</td>
                <td>${param.endValue}</td>
                <td>${param.duration}</td>
                <td style="font-size: 11px;">${param.easing}</td>
            `;
            tableBody.appendChild(row);
        });
    </script>
</body>
</html>'''

# 写入新文件
output_path = '/Users/panspro/Desktop/LeeSin_Export_双栏视图.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html_template)

print(f"✓ 已生成新的HTML文件: {output_path}")
print(f"✓ 解析了 {len(params)} 个参数")

