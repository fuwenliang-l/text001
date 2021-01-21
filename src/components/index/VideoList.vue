<template>
  <div class="Videolist-wrap">
    <div class="Back_home" @click="GoBack">
      <van-icon name="arrow-left" color="#FFFFFF" size="1rem" />
    </div>
   
    <swiper :options="swiperOption">
      <!-- 幻灯内容 -->
      <swiper-slide v-for="(item, index) in videoList" :key="index">
        <div>
          <videos ref="videos" :videoList="item" :index="index"></videos>
        </div>
         <div class="thumbs" @click.stop="goThumbs(item.videoId)">
            <van-icon name="like" :color="thumbsColor == false ? '#ffffff' : '#FB5531'" size="1.29rem" />
          </div>
        <div class="thumbs_count">{{ detailForH5.thumbsUpCount }}</div>
        <div class="content_name">{{ item.nickName }}</div>
        <div class="content_detiel">{{ item.content }}</div>
        <!-- <div class="comment_name">
          <van-icon name="chat" color="#ffffff" size="1.29rem" />
        </div> -->
        <!-- <div class="comment_count">{{ item.commentCount }}</div> -->
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import InfoBar from "./InfoBar";
import RightBar from "./RightBar";
import videos from "./Videos";
import { Icon } from "vant";
import axios from "axios";
export default {
  name: "videoList",
  data() {
    return {
      page: 1,
      swiperOption: {
        direction: "vertical",
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true, //自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化
        slidesPerView: 1,
        mousewheel: true,
        mousewheelControl: true,
        height: window.innerHeight, // 高度设置，占满设备高度
        resistanceRatio: 0,
        observeParents: true,
        initialSlide: 0,
        on: {
          tap: () => {
            this.playAction(this.thisIndex);
          },
          // 下滑结束
          slideNextTransitionStart: () => {
            this.thisIndex += 1;
            this.nextVideo(this.thisIndex);
            console.log(this.thisIndex);
          },
          // 上滑结束
          slidePrevTransitionEnd: () => {
            this.thisIndex -= 1;
            this.preVideo(this.thisIndex);
            console.log(this.thisIndex);
          },
        },
      },
      videoList: [],
      thirdFlag: "ARD",
      thirdUserId: "1",
      videoId: "",
      thisIndex: 0,
      pageNum: 1,
      pageSize: 10,
      finished: false,
      loading: false,
      thumbsColor: false,
      updateType: 0 ,//点赞
      detailForH5:{},
    };
  },
  components: {
    Swiper,
    SwiperSlide,
    videos,
    InfoBar,
    RightBar,
    [Icon.name]: Icon,
  },
  mounted() {
  },
  created() {
    // this.getVideoList()
    this.thisIndex = this.$route.query.index;
    this.videoList = JSON.parse(window.localStorage.getItem("allVideoData"));
    this.swiperOption.initialSlide = this.thisIndex;
    this.pageNum = this.$route.query.pageNum;
    this.videoId = this.$route.query.id;
    this.getInfoVideo();
  },
  methods: {
    //点赞
    goThumbs(id){
      this.thumbsColor = !this.thumbsColor;
      this.goInfoThumbs(id);
    },
    //返回
    GoBack() {
      this.$router.go(-1);
    },
    //点赞
     async goInfoThumbs(id) {
      var that = this;
      console.log(id);
      var res = await this.$request.post(`/api/gwVideo/updateThumbsUpForH5`, {
      // var res = await this.$request.post(`/gwVideo/updateThumbsUpForH5`, {
        videoId: that.videoId,
        thirdUserId : that.thirdUserId ,
        thirdFlag: that.thirdFlag,
      });
      console.log(res);
      if (res.data.apistatus === 200) {
        // 加载状态结束
        that.loading = false;
        console.log(res);
        if(res.data.data.updateType === 0){
          that.detailForH5.thumbsUpCount += 1
        }else{
          that.detailForH5.thumbsUpCount -= 1
        }
      }
    },
    //详情页
    async getInfoVideo() {
      var that = this;
      var res = await this.$request.post(`/api/gwVideo/detailForH5`, {
      // var res = await this.$request.post(`/gwVideo/detailForH5`, {
        videoId: that.videoId,
        thirdUserId: that.thirdUserId,
        thirdFlag: that.thirdFlag,
      });
      console.log(res);
      if (res.data.apistatus == 200) {
        // 加载状态结束
        that.loading = false;
        console.log(res);
        that.customerId = res.data.data.customerId
        that.thumbsColor = res.data.data.hasThumbsUp
        that.detailForH5 = res.data.data
      }
    },
    playAction(index) {
      this.$refs.videos[index].playOrStop();
    },
    // 滑动到下一个视频
    nextVideo(index) {
      console.log(index);
      var that = this;
      if (this.finished == false && index >= this.videoList.length - 1) {
        this.pageNum = this.pageNum + 1;
        var indexId;
        this.videoList.find((item, nextIndex) => {
          if (nextIndex == index) {
            that.videoId = item.videoId;
          }
        });
        this.getInfoVideo();
      } else {
        this.$refs.videos[index - 1].stop();
        this.$refs.videos[index].play();
      }
    },
    // 滑动到上一个视频
    preVideo(index) {
      console.log(index);
      this.$refs.videos[index + 1].stop();
      this.$refs.videos[index].play();
      this.getInfoVideo();
    },
    async getVideoList() {
      this.pageSize = this.$route.query.pageSize;
      var res = await this.$request.post("/api/gwLoveVideo/getPlazaList", {
      // var res = await this.$request.post("/gwLoveVideo/getPlazaList", { 
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
      if (res.data.apistatus == 200) {
        // 加载状态结束
        this.loading = false;
        var data = res.data.data;
        this.videoList = [...this.videoList, ...res.data.data.data];
        if (
          Math.ceil(data.total / this.pageSize) <= this.pageNum ||
          Math.ceil(data.total / this.pageSize) <= 1
        ) {
          this.finished = true;
        }
      }
    },
  },
  watch: {
    // showIndx(n){
    //   this.$nextTick(function () {
    //     this.$refs.mySwiper.swiper.slideTo(n, 1000, true)
    //   })
    // },
  },
};
</script>

<style lang="less" scoped>
.Videolist-wrap {
  background-color: #000;
  color: #ffffff;
  position: relative;
  .Back_home {
    width: 0.51rem;
    height: 0.94rem;
    position: fixed;
    top: 1.32rem;
    left: 0.94rem;
    z-index: 9;
  }
  .thumbs {
    width: 1.41rem;
    height: 1.29rem;
    position: absolute;
    text-align: center;
    top: 15.49rem;
    right: 0.64rem;
    z-index: 9;
  }
  .thumbs_count {
    width: 1.41rem;
    height: 1.29rem;
    position: absolute;
    top: 17.16rem;
    right: 0.64rem;
    z-index: 9;
    font-size: 0.51rem;
    color: #ffffff;
    text-align: center;
  }
  .comment_name {
    width: 1.41rem;
    height: 1.29rem;
    position: absolute;
    top: 19.42rem;
    right: 0.64rem;
    z-index: 9;
    color: #ffffff;
  }
  .content_name {
    width: 60%;
    font-size: 0.73rem;
    color: #ffffff;
    position: absolute;
    left: 0.64rem;
    bottom: 3.67rem;
  }
  .comment_count {
    width: 1.41rem;
    height: 1.29rem;
    position: absolute;
    top: 20.96rem;
    right: 0.64rem;
    z-index: 9;
    font-size: 0.51rem;
    color: #ffffff;
    text-align: center;
  }
  .content_detiel {
    width: 90%;
    height: 1.53rem;
    font-size: 0.6rem;
    position: absolute;
    left: 0.64rem;
    bottom: 1.62rem;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

/deep/ .vjs-custom-skin > .video-js .vjs-big-play-button {
  font-size: 1.5em;
  /*   top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
}

/deep/ .video-js {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>