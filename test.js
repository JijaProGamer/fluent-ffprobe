const fluent_ffmpeg = require('./index.js')
fluent_ffmpeg.FFPROBE_PATH = "C:\\ffmpeg\\bin\\ffprobe.exe"

fluent_ffmpeg.get(`http://live.mycamtv.com/blowjob.m3u8`,"aspect")
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.log(err)
})