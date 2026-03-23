# User Guide

## Installation

LeeSinMotion 4.0 is a CEP Extension. Installation is straightforward but requires placing the folder in the correct directory.

### Method 1: Manual Installation (Recommended)

1.  Download the **Source Code zip** from the [Latest Release](https://github.com/peelfig/LeeSinMotion/releases/latest).
2.  Unzip the file. You should see a folder containing `CSXS`, `client`, `host` directories.
3.  Rename the root folder to `com.peel.leesin.motion`.
4.  Move this folder to the Adobe CEP Extensions directory:

    **Mac OS:**
    ```bash
    /Library/Application Support/Adobe/CEP/extensions/com.peel.leesin.motion
    ```
    *(Note: You can use `Cmd+Shift+G` in Finder to paste this path)*

    **Windows:**
    ```bash
    C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.peel.leesin.motion
    ```

5.  **Important:** If you are using a self-signed extension (like this one), you need to enable "Player Debug Mode" for CEP.
    *   **Mac**: Open Terminal and run: `defaults write com.adobe.CSXS.11 PlayerDebugMode 1` (For AE 2022+). Replace `11` with `10`, `9`, etc., for older versions if needed.
    *   **Windows**: Open Registry Editor (`regedit`), go to `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`, add a String value named `PlayerDebugMode` with value `1`.

6.  Restart After Effects.
7.  Go to **Window > Extensions > LeeSinMotion**.

---

## Usage Modes

LeeSinMotion offers four powerful ways to inspect your animation:

### 1. Extract Fragment (提取片段)
*   **Best for:** Specific transitions or interactions.
*   **How:** Select two or more keyframes in the timeline. Click **"Extract"**.
*   **Result:** Generates a spec focusing only on the selected time range. Perfect for handing off a specific button press or page transition.

### 2. Single Keyframe Time (单帧时间)
*   **Best for:** Quick checks.
*   **How:** Move playhead to a keyframe, select the property. Click **"Single"**.
*   **Result:** Shows the exact time and value of that specific keyframe.
*   *Note: Export is disabled in this mode.*

### 3. Scan Layer (扫描图层)
*   **Best for:** Complex single-element animations.
*   **How:** Select a layer. Click **"Layer"**.
*   **Result:** Captures every keyframe property on that layer, generating a complete roadmap of its behavior.

### 4. Scan Composition (扫描合成)
*   **Best for:** Full page animations.
*   **How:** Click **"Comp"**.
*   **Result:** Iterates through **all layers** in the composition, generating a master spec document for the entire scene.

---

## Exporting HTML Timeline (New in v4.0)

Once you have scanned your data (using Extract, Layer, or Comp modes):

1.  Review the data in the text panel.
2.  Click the floating **Export** button (appears on hover).
3.  Choose a save location.
4.  **Done!** You now have a standalone `.html` file that visualizes your animation timeline perfectly. Send this file to your developers.
