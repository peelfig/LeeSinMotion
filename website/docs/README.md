---
home: true
heroVideo: ./video/IST_Example.mp4
tagline: Generate visual motion specs from After Effects and become an engineer's best friend.
actionText: Download v4.0.0
actionLink: https://github.com/peelfig/LeeSinMotion/releases/latest
# actionLink: ./download/LeeSinMotion.zip
usage:
- img: ./images/Panel.jpg
- title: Visual Export
  details: "The new <b>HTML Timeline Export</b> feature in v4.0 is a game changer. <br/><br/>Simply scan your animation (Keys, Layer, or Comp), and click the export button. You get a standalone, pixel-perfect HTML file with a visual timeline, precise duration markers, and easing curves.<br/><br/>No more guessing. What you see is exactly what developers need to code."
- title: Rich Data Extraction
  details: "<code>[Total Duration] 2000ms<br /><br />Layer: Button<br />- Opacity: 0 → 100% (Linear)<br />  Start: 0ms | Duration: 300ms <br /><br />- Scale: 80 → 100% (Cubic Bezier)<br />  Start: 100ms | Duration: 500ms<br />  Curve: (0.25, 0.1, 0.25, 1.0)</code>"
updates:
- title: New in v4.0.0
  details: "A complete rewrite of the core architecture. <br/><br/><b>Architecture:</b> Now a fully native CEP Extension (HTML/JS), compatible with After Effects CC 2014 through 2025.<br/><br/><b>Visual Timeline:</b> One-click export to a beautiful vertical-flow HTML timeline that developers love.<br/><br/><b>Smart Parsing:</b> Robust logic that never mistakes property values for layers, and automatically adjusts timelines to fit the longest animation."
- title: Key Features
  details: "<ul><li><b>One-Click Export:</b> Generate specific HTML specs instantly.</li><li><b>Range Auto-detect:</b> Timeline ruler automatically expands to fit your longest action.</li><li><b>Clean Layout:</b> Vertical flow design matches modern design specs.</li><li><b>Broad Support:</b> Works on Mac & Windows, AE CC 2014+.</li></ul>"
- title: Now supporting
  details: "<ul><li>Full Composition Scanning</li><li>Single Keyframe Mode (Hidden Export)</li><li>Hex Colors & Pseudo Effects</li></ul>"
addons:
- title: New Counter
  video: ./video/TimeCounter.mp4
  details: "Having a visual representation of the elapsed time on screen can often be helpful. Click to a add a new time counter layer at the playhead, and drag the <code>Start</code> and <code>End</code> markers to the beginning of the transition to easily illustrate the global start time.<br /><br />Alternatively, select a set of keyframes and click to automatically place the <code>Start</code> and <code>End</code> markers around the selected keys."
- title: Ease library
  img: ./images/Ease-library.jpg
  details: "The system generates easing curves as <a href=\"https://cubic-bezier.com/#.4,0,.2,1\">cubic bezier</a> easing functions. <br/><br/>To auto-detect reusable curves, you can customize the <code>ease-library.json</code> file in a text editor and add new curves in JSON format. <br/><br/> <code>\"material standard\"&#58 [<br />&#160 0.4,<br />&#160 0,<br />&#160 0.2,<br />&#160 1<br />],</code>"
footer: "Built for motion perfectionists. v4.0.0 released by <a href=\"https://github.com/peelfig\">peelfig</a>."
---
