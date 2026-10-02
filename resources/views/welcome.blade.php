<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="theme-color" content="#87c9e8">
        <title>Pelican on a Bicycle — WebXR</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body>
        <div id="app"></div>
        <div id="hud">
            <h1>Pelican on a Bicycle</h1>
            <p>Drag to orbit · scroll to zoom. Put on a WebXR headset and hit Enter VR for immersive view.</p>
            <p id="vr-hint">Checking WebXR support…</p>
        </div>
    </body>
</html>
