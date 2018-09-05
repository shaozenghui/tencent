const app = getApp();
var plugin = requirePlugin("WechatSI")

Page({
    data: { 
        froms:"",//需要翻译的值
        tos: "",//翻译结果
        src:'',//合成语音结果
        lfrom: "zh_CN",//需要翻译的语言
        lto: "en_US",//翻译结果的语言
    },

    // 开关发生改变时
    switch1Change: function (e) {
        this.setData({
            tos: "",
            froms: "",
            src: "",
            src2:"",
        })
        if (!e.detail.value){
            this.setData({
                lfrom: "en_US",
                lto: "zh_CN",
            })
        }
    },
    onReady: function (e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        this.audioCtx = wx.createAudioContext('myAudio');
        this.audioCtx2 = wx.createAudioContext('myAudio2');
    },
    // 播放合成语音
    audioPlay: function () {
        this.audioCtx.play()
    },
    audioPlay2: function () {
        this.audioCtx2.play()
    },
    // 翻译内容发成改变时
    change(val){
        var that = this;
        console.log(val.detail.value)
        this.setData({
            froms: val.detail.value
        })
        plugin.textToSpeech({
            lang: that.data.lfrom,
            tts: true,
            content: that.data.froms,
            success: function (res) {
                console.log("succ tts", res.filename);
                that.setData({
                    src2: res.filename,
                })
            },
            fail: function (res) {
                console.log("fail tts", res)
            }
        })
    },
    // 翻译
    translate() {
        var that = this;
        plugin.translate({
            lfrom: that.data.lfrom,
            lto: that.data.lto,
            tts:true,//是否需要合成语音
            content: this.data.froms,//需要翻译的内容
            success: function(res) {
                if (res.retcode == 0) {
                    that.setData({
                        tos: res.result,
                        src: res.filename,
                    })
                } else {
                    wx.showToast({
                        title: '翻译失败',
                    })
                    console.warn("翻译失败", res)
                }
            },
            fail: function(res) {
                wx.showToast({
                    title: '翻译失败',
                })
                console.log("网络失败", res)
            }
        })
    }
})