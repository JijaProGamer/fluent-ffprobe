const { exec } = require("child_process");
const fs = require("fs");

function call_ffprobe(backArgs, file, endArgs, initialWaitTime, waitTime) {
    return new Promise((resolve, reject) => {
        let output = ""
        let lastoutput = (Date.now() / 1000) + initialWaitTime

        exec(`${module.exports.FFPROBE_PATH} ${backArgs} -i "${file}" ${endArgs}`, function (error, stdout, stderr) {
            if (error) return reject(error || stderr)

            if (waitTime <= 0) {
                resolve(stdout)
            } else {
                output += stdout
                lastoutput = Date.now() / 1000
            }
        })

        if (waitTime > 0) {
            setTimeout(() => {
                let interval = setInterval(() => {
                    if (((Date.now() / 1000) - lastoutput) >= waitTime) {
                        clearInterval(interval)
                        resolve(output)
                    }
                }, 50)
            }, initialWaitTime)
        }
    })
}
const functions = {
    duration: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe("", path, `-show_entries format=duration -v quiet -of csv="p=0"`, 0, 0)
                .then(res => resolve(parseFloat(res.replace(/(\r\n|\n|\r)/gm, ""))))
                .catch(err => reject(err))
        })
    },
    resolution: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0`, path, "", 0, 0)
                .then(res => resolve(res.replace(/(\r\n|\n|\r)/gm, "")))
                .catch(err => reject(err))
        })
    },
    subtitles: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-loglevel error -select_streams s -show_entries stream=index:stream_tags=language -of csv=p=0`, path, "", 0, 0)
                .then(res => {
                    let subs = res.replace(/(\r\n|\n|\r)/gm, ";").split(";")
                    subs.pop()
                    resolve(subs)
                })
                .catch(err => reject(err))
        })
    },
    format: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-v quiet -print_format json -show_format`, path, "", 0)
                .then(res => resolve(JSON.parse(res).format))
                .catch(err => reject(err))
        })
    },
    size: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe('-show_entries format=size -v quiet -of csv="p=0"', path, "", 0)
                .then(res => resolve(parseFloat(res / 1000000)))
                .catch(err => reject(err))
        })
    },
    framerate: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-v error -select_streams v:0 -of default=noprint_wrappers=1:nokey=1 -show_entries stream=r_frame_rate`, path, "", 0, 0)
                .then(res => {
                    let framerate_raw = res.split("/")
                    let framerate = parseFloat(parseInt(framerate_raw[0]) / parseInt(framerate_raw[1]))
                    resolve(framerate)
                })
                .catch(err => reject(err))
        })
    },
    vcodec: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-v 0 -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1`, path, "", 0, 0)
                .then(res => {
                    resolve(res.split("\n")[1].trim())
                })
                .catch(err => reject(err))
        })
    },
    acodec: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-v 0 -select_streams a:0 -show_entries stream=index,codec_name,channels:stream_tags=language -of default=nk=1:nw=1`, path, "", 0, 0)
                .then(res => {
                    resolve(res.split("\n")[1].trim())
                })
                .catch(err => reject(err))
        })
    },
    aspect: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-v error -select_streams v:0 -show_entries stream=width,height,sample_aspect_ratio,display_aspect_ratio -of json=c=1 `, path, "", 0, 0)
                .then(res => {
                    resolve(JSON.parse(res).streams[0])
                })
                .catch(err => reject(err))
        })
    },
    vbitrate: (path) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(`-v error -select_streams v:0 -show_entries stream=width,height,duration,bit_rate -of default=noprint_wrappers=1 -print_format json -show_format`, path, "", 0)
                .then(res => {
                    console.log(2)
                    let format = JSON.parse(res).format
                    console.log(res)
                    resolve(format)
                })
                .catch(err => reject(err))
        })
    },
}

module.exports = {
    get: (file, name) => {
        return new Promise((resolve, reject) => {
            let func = functions[name]
            if (func) {
                func(file)
                    //call_ffprobe(func.backArgs, file, func.endArgs)
                    .then((result) => {
                        resolve(result)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            } else {
                reject(`Function not found: ${name}`)
            }
        })
    },

    get_raw: (backArgs, file, endArgs) => {
        return new Promise((resolve, reject) => {
            call_ffprobe(backArgs, file, endArgs)
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
}