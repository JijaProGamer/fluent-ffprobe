Library for quickly accesing ffprobe.
You can use @ffprobe-installer/ffprobe to get the path

```javascript
const fluent_ffprobe = require("fluent-ffprobe")
fluent_ffprobe.FFPROBE_PATH = "" // The path to the ffprobe executable.

// Both functions return a promise

fluent_ffprobe.get(file, command) // Uses pre-made arguments. Errors if command is invalid
fluent_ffprobe.get_raw(backArgs, file, endArgs) // Uses your own arguments
// Example for get_raw
// fluent_ffprobe.get_raw(`-show_entries format=size -v quiet -of csv="p=0"`,"file_name_here",``)

/*
List of commands:
    duration: Gets video duration in seconds and miliseconds
    resolution: Returns resolution in weidth x height format
    subtitles: Returns subtitles in id,language array format
    size: Get file size in bytes
    format: Gets video format
    framerate: Gets framerate. It is a float. You may need to Math.round it
    vcodec: returns the video codec
    acodec: returns the audio codec

Example of video format:

{"format": {
        "filename": "C:\\ffmpeg\\bin\\video.wmv",
        "nb_streams": 2,
        "nb_programs": 0,
        "format_name": "asf",
        "format_long_name": "ASF (Advanced / Active Streaming Format)",
        "start_time": "0.000000",
        "duration": "9.633000",
        "size": "1133506",
        "bit_rate": "941352",
        "probe_score": 100,
        "tags": {
            "WMFSDKNeeded": "0.0.0.0000",
            "DeviceConformanceTemplate": "M0",
            "WMFSDKVersion": "12.0.19041.1586",
            "IsVBR": "0"
        }
    }
*/
```