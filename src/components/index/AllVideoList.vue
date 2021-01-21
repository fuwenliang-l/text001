<template>
  <div class="allVideoList_box">
    <div class="header">
      <div>
        <van-icon
          name="arrow-left"
          size="0.9rem"
          color=" #252525"
          @click="goback"
        />
      </div>
      <div>短视频</div>
      <div><van-icon name="arrow-left" size="0.9rem" color=" #fff" /></div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getVideoList"
    >
      <div class="item_list">
        <div class="list_left">
          <div
            class="item_box"
            v-for="item in dataListLeft"
            :key="item.videoId"
            @click="goVideo(item.videoId)"
          >
            <div class="item_img_box">
              <!-- <img :src="item.pictureAddress" :style="{'height':10*Math.random()+'rem','min-height':'6rem'}"/> -->
              <img :src="item.pictureAddress" :style="{ height: '12.76rem' }" />
            </div>
            <div class="des_box">
              <div class="content">{{ item.content }}</div>
              <div class="customerImg_name">
                <!-- <img :src="item.customerImg" class="customerImg" /> -->
                <span class="name">{{ item.nickName ? item.nickName : '匿名'  }}</span>
                <span class="tages">
                  <van-icon name="like-o" size="0.6rem" :color="item.hasThumbsUp == false ? '#999999' : '#FB5531'" />
                  {{item.thumbsUpCount}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="list_right">
          <div
            class="item_box"  
            v-for="item in dataListRight"
            :key="item.videoId"
            @click="goVideo(item.videoId)"
          >
            <div class="item_img_box">
              <img :src="item.pictureAddress" :style="{ height: '12.76rem' }" />
            </div>
            <div class="des_box">
              <div class="content">{{ item.content }}</div>
              <div class="customerImg_name">
                <!-- <img :src="item.customerImg" class="customerImg" /> -->
                <span class="name">{{ item.nickName ? item.nickName : '匿名' }}</span>
                <!-- <span class="name">{{this.$store.sate.name}}</span> -->
                <span class="tages">
                  <van-icon name="like-o" size="0.6rem" :color="item.hasThumbsUp == false ? '#999999' : '#FB5531'"  />
                  {{item.thumbsUpCount}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
import { List, Icon } from "vant";
// import {mapState, mapActions, mapGetters} from 'vuex';
export default {
  name: "allVideoList",
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      thirdFlag: "ARD",
      thirdUserId: "1",
      dataList: [],
      dataListLeft: [],
      dataListRight: [],
      loading: false,
      finished: false,
    };
  },
  components: {
    [List.name]: List,
    [Icon.name]: Icon,
  },
 computed:{

},
  created() {
    
  },
  mounted(){
  },
  methods: {
    async getVideoList() {
      var that = this;
      // var res = await this.$request.post("/gwVideo/selectListForH5", {
      var res = await this.$request.post("/api/gwVideo/selectListForH5", {
        pageNum: that.pageNum,
        pageSize: that.pageSize,
        thirdUserId: that.thirdUserId,
        thirdFlag: that.thirdFlag,
      });
      console.log(res);
      if (res.data.apistatus == 200) {
        // 加载状态结束
        that.loading = false;
        var data = res.data.data;
        that.dataList = [...that.dataList, ...res.data.data.videoList];
        res.data.data.videoList.forEach(function (item, index) {
          if (index % 2 == 0) {
            that.dataListLeft.push(item);
          } else {
            that.dataListRight.push(item);
          }
        });
        if (
          Math.ceil(data.total / that.pageSize) <= that.pageNum ||
          Math.ceil(data.total / that.pageSize) <= 1
        ) {
          that.finished = true;
        } else {
          that.pageNum = that.pageNum + 1;
        }
      }
    },
    goVideo(id) {
      window.localStorage.setItem(
        "allVideoData",
        JSON.stringify(this.dataList)
      );
      var index = 0;
      this.dataList.forEach((item, i) => {
        if (id == item.id) {
          index = i;
        }
      });
      this.$router.push({
        path: "/videoList",
        query: {
          id: id,
          index: index,
          pageNum: this.pageNum - 1,
          pageSize: this.pageSize,
        },
      });
    },
    //返回
    goback() {
      console.log("点击返回");
    },
  },
};
</script>

<style lang="less" scoped>
.allVideoList_box {
  margin-top:  1.94rem;
  font-size: 0.6rem;
  text-align: center;
  background-color: #eff3f6;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.94rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .van-icon {
      margin-left: 0.34rem;
    }
  }
  .item_list {
    padding: 0.6rem;
    font-size: 0.6rem;
    background-color: #eff3f6;
    overflow: hidden;
    text-align: left;
    color: #333333;
    font-size: 0.51rem;
    .list_left {
      width: 48%;
      float: left;
      .content {
        padding: 0.34rem;
        height: 1.4rem;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .list_right {
      width: 48%;
      float: right;
      .content {
        padding: 0.34rem;
        height: 2rem;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .item_box {
      width: 100%;
      // height: 10rem;
      border-radius: 0.2rem;
      background-color: #fff;
      margin-bottom: 0.5rem;
      overflow: hidden;
      .item_img_box {
        width: 100%;
        // height: 6rem;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .des_box {
        // height: 4rem;

        .content {
          color: #333333;
          font-size: 0.51rem;
        }
        .customerImg_name {
          padding: 0.2rem 0.34rem 0.64rem 0.34rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .customerImg {
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 0.2rem;
          }
          .tages{
            display: flex;
            align-items: center;
            .van-icon{
              padding: 0 0.26rem 0 0;
            }
          }
        }
      }
    }
  }
}
</style>
