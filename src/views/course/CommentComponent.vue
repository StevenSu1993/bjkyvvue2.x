<template>
  <div class="entireComponent">
    <div class="content">
      <div class="userDetail">
        <div style="display: inline-block;">
          <el-avatar :src="avatarUrl"></el-avatar>
          <!--          <img :src="avatarUrl" style="width: 50px" alt="头像"/>-->
        </div>

        <div style="display: inline-block;margin-left: 16px">
          <div style="display: inline-block">{{ userName }}</div>
          <div style="display: inline-block; color:#3d7dfd">&nbsp;&nbsp;编辑</div>
          <div style="color:#aeb6c4;font-size:12px">已完成{{ finishedCount }}个作业 创建于 {{ createTime }}</div>
        </div>
      </div>
      <div class="commentFunc">删除</div>

    </div>
    <!--    文本消息-->
    <div class="textContent"> {{ txtContent }}</div>
    <!--    语音消息内容，也可能是视频-->
    <div>
      <my-audio style="display: inline-block" :fileurl='voiceMsgUrl'/>
      <span class="iconfont icon-xiazai download" @click="downLoadVoice(voiceMsgUrl)"></span>
    </div>
    <div class="footerTools">
      <span class="commentFunc" v-if="isisShowCommentBtn" @click="showComment">收起评论</span>
      <span class="commentFunc" v-else></span>
      <div class="footerBox">
         <span class="iconfont icon-shoucang commentFunc">
          精选
        </span>

        <span class="iconfont icon-xiazai commentFunc">
          下载长图
        </span>
        <span class="iconfont icon-dianzan commentFunc">
          点赞
        </span>
        <span class="iconfont icon-dianping commentFunc"
              @click="toComment">
          点评
        </span>
        <el-dialog
            class="dialog"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width='680px'
            heigth="400px"
            append-to-body
            top="15vh">

          <!--         点评弹出框页面-->
          <div>
<!--            <div>-->
<!--              <el-form ref="form" :model="form">-->
<!--                <el-form-item style="margin-bottom: 0" label="评分：" label-width="100px" prop="name">-->
<!--                  &lt;!&ndash;                  <Stars></Stars>&ndash;&gt;-->
<!--                  <el-rate-->
<!--                      text-color="#ff9900"-->
<!--                      v-model="form.startValue"-->
<!--                      show-score>-->
<!--                  </el-rate>-->
<!--                </el-form-item>-->

<!--                <el-form-item style="margin-bottom: 0" label="点评：" label-width="100px" prop="name">-->
<!--                  <el-input type="textarea" :rows="5" v-model="form.desc"></el-input>-->
<!--                </el-form-item>-->

<!--                <el-form-item style="margin-top: 20px" label-width="100px" prop="name">-->
<!--                  <div>-->
<!--                    <el-button>提交点评</el-button>-->
<!--                    <el-button>取消</el-button>-->
<!--                  </div>-->
<!--                </el-form-item>-->
<!--              </el-form>-->

<!--            </div>-->

            <CommentForm :commentId="commentId"></CommentForm>

            <div></div>
          </div>

        </el-dialog>
      </div>

    </div>
    <!--    评论的东西-->
    <div v-if="isShowComment">
      <div style="padding: 30px" v-for="(item,index) in commentListByCommentId" :key="index">
        <div class="commitContent">
          <div class="userDetail">
            <div style="display: inline-block">
              <el-avatar :src="item.avatarUrl"></el-avatar>
            </div>
            <div style="display: inline-block">
              <div style="display: inline-block;margin-left: 16px">{{ item.userName }}</div>
              <div style="color:#aeb6c4;font-size:12px">点评于 &nbsp; &nbsp; {{ timeFormat(item.createTime) }}</div>
            </div>
          </div>
          <div>
            <span class="commentFunc">回复</span>
            <span class="commentFunc">删除</span>
          </div>
        </div>
        <div class="textContent">{{ item.textContent }}</div>
        <!--    语音消息内容，也可能是视频-->
        <my-audio style="display: inline-block" :fileurl='voiceMsgUrl'/>
      </div>

    </div>
  </div>
</template>

<script>
import { formatDate, getCommentByCommentId } from '@/api/homeWorkFunc'
import CommentForm from '@/views/course/component/CommentForm'

export default {
  props: ['userName', 'avatarUrl', 'createTime', 'finishedCount', 'voiceMsgUrl', 'commentId', 'txtContent'],
  components: { CommentForm },
  name: 'CommentComponent',
  data () {
    return {
      startValue: null,
      dialogVisible: false,
      form: {},
      isisShowCommentBtn: false,
      isShowComment: false,
      commentListByCommentId: []
    }
  },
  mounted () {
    var params = { commentId: this.commentId }
    getCommentByCommentId(params).then(res => {
      // console.log('判断是否获取到了数据', this.commentId, res)
      if (res !== null && res !== undefined) {
        this.commentListByCommentId = res
        this.isisShowCommentBtn = true
      }
    })
  },
  methods: {
    timeFormat (val) {
      return formatDate(val)
    },
    showComment () {
      this.isShowComment = !this.isShowComment
    },
    handleClose (done) {
      done()
    },
    toComment () {
      this.dialogVisible = true
    },
    downLoadVoice (url) {
      const arr = url.split('/')
      const fileName = arr[arr.length - 1]
      fetch(url).then(res => {
        res.blob().then(blob => {
          const a = document.createElement('a')
          const url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = fileName
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    }
  }
}
</script>

<style scoped>

.entireComponent {
  margin-left: 30px;
  padding: 12px;
  background-color: #ffffff;
  box-shadow: #000000 0px 0px 1px 0px;
}

.content {
  /*background: pink;*/
  display: flex;
  justify-content: space-between;
}

.footerTools {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.footerBox {
  /*background: green;*/
}

.commitContent {
  display: flex;
  justify-content: space-between;
}

.playVoice {
  background-color: #3d7dfd;
  border-radius: 4px;
}

.textContent {
  color: #354369;
  font-size: 14px;
  line-height: 24px;
  margin: 8px 0px;
}

.download {
  display: inline-block;
  color: #aeb6c4;
  font-size: 16px;
  font-family: iconfont;
  margin: 0 0 0 30px;

}

.commentFunc {
  margin-left: 20px;
  font-size: 14px;
  color: #aeb6c4;
}

.commentFunc:hover {
  cursor: pointer;
  color: #3d7dfd;

}
</style>
