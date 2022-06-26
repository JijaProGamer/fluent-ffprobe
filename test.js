const fluent_ffprobe = require('./index.js')
fluent_ffprobe.FFPROBE_PATH = "C:\\ffmpeg\\bin\\ffprobe.exe"

fluent_ffprobe.get(`http://live.mycamtv.com/blowjob.m3u8`,"vbitrate")
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.log(err)
})