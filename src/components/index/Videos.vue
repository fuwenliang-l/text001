<template>
  <div class="videos-wrap" id="videos-wrap">
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
    ></video-player>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
export default {
  name: "videos",
  props: ["videoList", "index"],
  data() {
    return {
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto",
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            src: this.videoList.videoAddress, // 路径
            type: "video/mp4" ,// 类型
          }
        ],
        //poster: "../../static/images/test.jpg", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: false
      //   controlBar: {
      // timeDivider: true,
      // durationDisplay: true,
      // remainingTimeDisplay: true,
      // fullscreenToggle: true  //全屏按钮
    // }
      },
      playing: true // 播放状态
    };
  },
  components: {
    videoPlayer
  },
  created(){
    this.autoPlayAction();
  },
  methods: {
         createMyButton () {
            let Button = videojs.getComponent('Button')
            let myButton = videojs.extend(Button, {
                constructor: function (player, options) {
                    Button.apply(this, arguments)
                    this.addClass('fullscreen-enter')
                },
                handleClick: () => {
                    console.log('的沙发上看电话给');
                },
                buildCSSClass: function () {
                  return 'vjs-icon-custombutton vjs-control vjs-button'
                }
            })
            
            //注册
            videojs.registerComponent('myButton', myButton)
            
            this.$nextTick(() => {
                // 添加到controlBar中
                this.$refs.videoPlayer1.player.getChild('controlBar').addChild('myButton')
            })
        },

    // 点击播放或暂停视频
    playOrStop(){
      if(this.playing) {
        this.$refs.videoPlayer.player.load();
        this.$refs.videoPlayer.player.pause();
        this.playing = false;
      }else {
        this.$refs.videoPlayer.player.load();
        var playPromise = this.$refs.videoPlayer.player.play();
        if (playPromise) {
            playPromise.then(() => {
                // 音频加载成功
                // 音频的播放需要耗时
                setTimeout(() => {
                    // 后续操作
                    console.log("done.");
                }, this.$refs.videoPlayer.player.duration * 1000); // audio.duration 为音频的时长单位为秒


            }).catch((e) => {
                // 音频加载失败
            });
        }
        this.playing = true;
      }
    },

    // 自动播放第一个视频
    autoPlayAction(){
      if(this.index===0) {
        this.playerOptions.autoplay = true
      }
    },
    play(){
      this.$refs.videoPlayer.player.load();
      this.$refs.videoPlayer.player.play();
      this.playing = true;
    },
    stop(){
      this.$refs.videoPlayer.player.pause();
      this.playing = false;
    }
  },
  watch:{
    // videoList(newVal,oldVal) {
    //   this.playerOptions.sources[0].src = newVal
    // }
  }
};
</script>

<style lang="less" scoped>

.video-js{
      .vjs-control-bar{
        .vjs-icon-custombutton {
          font-family: VideoJS;
          font-weight: normal;
          font-style: normal; }
          .vjs-icon-custombutton:before {
            // content: "\f108";
            content: "9";
            font-size: 1.8rem;
            line-height: 1.67rem;
          }
      }
    }

</style>