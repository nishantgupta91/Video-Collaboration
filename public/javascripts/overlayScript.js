/**
 * Created by Nishant on 6/27/2015.
 */
isPlaying = false;

function init() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
}

function handleVideo(stream) {
    var videoElem = document.getElementById("cameraVideo");
    videoElem.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    // do something
}

function Play() {
    if (!isPlaying) {
        document.getElementById("handVideo").play();
        //document.getElementById("videoBackgrounddata").play();
        document.getElementById("PlayPause").innerHTML = "Pause";
        isPlaying = true;
    }
    else {
        document.getElementById("handVideo").pause();
        //document.getElementById("videoBackgrounddata").pause();
        document.getElementById("PlayPause").innerHTML = "Play";
        isPlaying = false;
    }
    draw();
}

function Reset() {
    document.getElementById("handVideo").load();
    if (isPlaying)
        document.getElementById("PlayPause").innerHTML = "Play";
    isPlaying = false
}

function rgb2hsv (r,g,b) {
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    //remove spaces from input RGB values, convert to int
    var r = parseInt( (''+r).replace(/\s/g,''),10 );
    var g = parseInt( (''+g).replace(/\s/g,''),10 );
    var b = parseInt( (''+b).replace(/\s/g,''),10 );

    if ( r==null || g==null || b==null ||
        isNaN(r) || isNaN(g)|| isNaN(b) ) {
        alert ('Please enter numeric RGB values!');
        return;
    }
    if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
        alert ('RGB values must be in the range 0 to 255.');
        return;
    }
    r=r/255; g=g/255; b=b/255;
    var minRGB = Math.min(r,Math.min(g,b));
    var maxRGB = Math.max(r,Math.max(g,b));

    // Black-gray-white
    if (minRGB==maxRGB) {
        computedV = minRGB;
        return [0,0,computedV];
    }

    // Colors other than black-gray-white:
    var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
    var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
    computedH = 60*(h - d/(maxRGB - minRGB));
    computedS = (maxRGB - minRGB)/maxRGB;
    computedV = maxRGB;
    return [computedH,computedS,computedV];
}

function draw() {
    if (window.requestAnimationFrame) window.requestAnimationFrame(draw);
    // IE implementation
    else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(draw);
    // Firefox implementation
    else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(draw);
    // Chrome implementation
    else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(draw);
    // Other browsers that do not yet support feature
    else setTimeout(draw, 16.7);
    DrawVideoOnCanvas();
}

function DrawVideoOnCanvas() {
    var object = document.getElementById("handVideo")
    var backgroundObject;
    backgroundObject = document.getElementById("cameraVideo");
    var width = object.width;
    var height = object.height;
    var canvas = document.getElementById("outputCanvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.globalAlpha = 1;   // Full opacity
        context.drawImage(backgroundObject, 0, 0, width, height);
        var imgBackgroundData = context.getImageData(0, 0, width, height);
        context.globalAlpha = 0.8;  // Low opacity
        context.drawImage(object, 0, 0, width, height);
        imgDataNormal = context.getImageData(0, 0, width, height);
        var imgData = context.createImageData(width, height);

        for (i = 0; i < imgData.width * imgData.height * 4; i += 4) {
            var r = imgDataNormal.data[i + 0];
            var g = imgDataNormal.data[i + 1];
            var b = imgDataNormal.data[i + 2];
            var a = imgDataNormal.data[i + 3];

            hsl = rgb2hsv(r, g, b)
            if (hsl[0]>80)
                a = 0;
            /*
             // compare rgb levels for green and set alphachannel to 0;
             selectedR = 105; //document.getElementById('redRangevalue').value;
             selectedG = 105; //document.getElementById('greenRangevalue').value;
             selectedB = 105; //document.getElementById('blueRangevalue').value;
             if (r >= selectedR && g >= selectedG && b >= selectedB) {
             a = 0;
             }
             */
            if (a != 0) {
                imgData.data[i + 0] = r;
                imgData.data[i + 1] = g;
                imgData.data[i + 2] = b;
                imgData.data[i + 3] = a;
            }

        }

        for (var y = 0; y < imgData.height; y++) {
            for (var x = 0; x < imgData.width; x++) {
                var r = imgData.data[((imgData.width * y) + x) * 4];
                var g = imgData.data[((imgData.width * y) + x) * 4 + 1];
                var b = imgData.data[((imgData.width * y) + x) * 4 + 2];
                var a = imgData.data[((imgData.width * y) + x) * 4 + 3];
                if (imgData.data[((imgData.width * y) + x) * 4 + 3] != 0) {
                    offsetYup = y - 1;
                    offsetYdown = y + 1;
                    offsetXleft = x - 1;
                    offsetxRight = x + 1;
                    var change=false;
                    if(offsetYup>0)
                    {
                        if(imgData.data[((imgData.width * (y-1) ) + (x)) * 4 + 3]==0)
                        {
                            change=true;
                        }
                    }
                    if (offsetYdown < imgData.height)
                    {
                        if (imgData.data[((imgData.width * (y + 1)) + (x)) * 4 + 3] == 0) {
                            change = true;
                        }
                    }
                    if (offsetXleft > -1) {
                        if (imgData.data[((imgData.width * y) + (x -1)) * 4 + 3] == 0) {
                            change = true;
                        }
                    }
                    if (offsetxRight < imgData.width) {
                        if (imgData.data[((imgData.width * y) + (x + 1)) * 4 + 3] == 0) {
                            change = true;
                        }
                    }
                    if (change) {
                        var gray = (imgData.data[((imgData.width * y) + x) * 4 + 0] * .393) + (imgData.data[((imgData.width * y) + x) * 4 + 1] * .769) + (imgData.data[((imgData.width * y) + x) * 4 + 2] * .189);
                        imgData.data[((imgData.width * y) + x) * 4] = (gray * 0.2) + (imgBackgroundData.data[((imgData.width * y) + x) * 4] *0.9);
                        imgData.data[((imgData.width * y) + x) * 4 + 1] = (gray * 0.2) + (imgBackgroundData.data[((imgData.width * y) + x) * 4 + 1]*0.9);
                        imgData.data[((imgData.width * y) + x) * 4 + 2] = (gray * 0.2) + (imgBackgroundData.data[((imgData.width * y) + x) * 4 + 2] * 0.9);
                        imgData.data[((imgData.width * y) + x) * 4 + 3] = 255;
                    }
                }

            }
        }

        for (i = 0; i < imgData.width * imgData.height * 4; i += 4) {
            var r = imgData.data[i + 0];
            var g = imgData.data[i + 1];
            var b = imgData.data[i + 2];
            var a = imgData.data[i + 3];
            if (a == 0) {
                imgData.data[i + 0] = imgBackgroundData.data[i + 0];
                imgData.data[i + 1] = imgBackgroundData.data[i + 1];
                imgData.data[i + 2] = imgBackgroundData.data[i + 2];
                imgData.data[i + 3] = imgBackgroundData.data[i + 3];
            }
        }
        context.putImageData(imgData, 0, 0);

    }
}