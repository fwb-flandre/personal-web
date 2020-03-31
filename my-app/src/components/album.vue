<template>
  <div class="album">
    <el-button class="uploadButton" type="primary" @click="dialog1 = true" v-show="buttonVisible">点击上传图片</el-button>
    <div class="head">
      <el-button type="primary" @click="back_homepage()" v-show="buttonVisible">返回首页</el-button>
    </div>
    <el-dialog
      :visible.sync="dialog1"
      width="30%">
      <el-upload
        class="upload"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :http-request="uploadPhoto"
        :file-list="fileList"
        accept=".jpg,.jpeg,.png"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过1mb</div>
      </el-upload>
    </el-dialog>
    <div class="img">
      <div v-for="(item,index) in photo" :key='item' class="base64img">
        <div class="imgDiv"  :style="imgStyle">
          <!-- 引入 viewer 预览图片 -->
          <viewer>
            <img v-bind:src="photo[index]" :style="imgStyle" class="baseImg" @load="imgLoad(index)">
          </viewer>
          <div class="imgDiscribe">
            <div class="imgName">{{photo_name[index]}}</div>
            <el-button type="text" icon="el-icon-edit" class="imgButton1" @click="edit(index, item)"></el-button>
            <el-button type="text" icon="el-icon-download" class="imgButton2" @click="download(index)"></el-button>
            <el-button type="text" icon="el-icon-delete" class="imgButton3" @click="del(index, item)"></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'album',
  data () {
    return {
      qiniu: {
        imageUrl: '',
        token: {},
        // 这是根据你创建空间时所选择的地区
        domain: 'https://up-z2.qiniup.com',
        // 这是七牛云空间的外链默认域名
        qiniuaddr: 'q5a530cvj.bkt.clouddn.com'
      },
      browserWidth: '',
      photo: [],
      photo_name: [],
      dialog1: false,
      dialog2: false,
      Img: {
        baseImg: [],
        imgDiv: [],
        deleteImg: [],
        imgName: [],
        imgButtons: {
          imgButton1: [],
          imgButton2: [],
          imgButton3: []
        }
      },
      buttonVisible: false,
      err_code: '',
      correct_code: '',
      files: '',
      fileList: [],
      formInline: {
        img: ''
      },
      imgStyle: {
        width: ''
      },
      tunnels: [100, 100, 100],
      count: 0,
      isLazyLoad: false
    }
  },
  watch: {
    err_code (newName, oldName) {
      switch (this.err_code) {
        case 1:
          this.$message.error('图片已存在')
          this.$refs.upload.clearFiles()
          this.err_code = ''
          break
      }
    },
    correct_code (newName, oldName) {
      switch (this.correct_code) {
        case 1:
          this.$message.success('图片已添加')
          this.$refs.upload.clearFiles()
          this.correct_code = ''
          break
        case 2:
          this.$message.success('删除成功')
          this.correct_code = ''
          break
        case 3:
          this.correct_code = ''
          break
        case 4:
          this.$message.success('修改成功')
          this.clear()
          this.lazyLoad()
          this.correct_code = ''
          break
      }
    },
    // 根据浏览器大小调节图片大小
    browserWidth (newName, oldName) {
      this.debounce(this.resetWidth, 200)()
    }
  },
  methods: {
    clear () {
      this.photo = []
      this.photo_name = []
      this.count = 0
      this.tunnels = [100, 100, 100]
    },
    // 图片懒加载模块，有节流功能
    lazyLoad () {
      this.isLazyLoad = true
      let smallIndex = this.indexOfSmallest(this.tunnels)
      if (this.tunnels[smallIndex] - 100 < document.documentElement.scrollTop + document.body.clientHeight) {
        this.axios.post('http://47.103.15.224:8080/api/album/update', {
          count: this.count
        })
          .then(res => {
            // 相当于节流
            if (res.data.err_code === 2) {
              this.isLazyLoad = false
            } else {
              this.photo.push(res.data.result[0].photo)
              this.photo_name.push(res.data.result[0].name)
              this.count++
              this.lazyLoad()
            }
          })
      } else {
        this.isLazyLoad = false
      }
    },
    // 调节瀑布流宽度
    resetWidth () {
      this.tunnels = [100, 100, 100]
      for (let i = 0; i < this.photo.length; i++) {
        this.imgLoad(i)
      }
    },
    // 防抖函数
    debounce (fn, wait) {
      var timeout = null
      return function () {
        if (timeout !== null) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(fn, wait)
      }
    },
    // 返回首页
    back_homepage () {
      window.location.href = 'http://47.103.15.224:8080/'
    },
    // 修改照片名字模块
    edit (index, item) {
      this.$prompt('修改照片名字', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.axios.post('http://47.103.15.224:8080/api/album/update_name', {
          photo: item,
          name: value
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
          })
      }).catch(() => {
        // 取消后进行的操作
      })
    },
    // 下载模块
    download (index) {
      var file = this.base64ToFile(this.photo[index], '')
      var filename = this.photo_name[index]
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = filename // 这里填保存成的文件名
      link.click()
      URL.revokeObjectURL(link.href)
    },
    base64ToFile (dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      // 用于解码 base64
      var bstr = atob(arr[1])
      var n = bstr.length
      // 将 string 类型转为 utf-16格式
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime }) // file 类型
    },
    // 删除模块
    del (index, item) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 将想要删除的元素置为空
        this.Img.baseImg[index].style.width = 0
        this.Img.imgDiv[index].style.width = 0
        this.Img.imgName[index].style.fontSize = 0
        this.Img.imgButtons.imgButton1[index].style.fontSize = 0
        this.Img.imgButtons.imgButton2[index].style.fontSize = 0
        this.Img.imgButtons.imgButton3[index].style.fontSize = 0
        // 记录删除元素索引
        this.Img.deleteImg[index] = index
        this.axios.post('http://47.103.15.224:8080/api/album/delete', {
          photo: item
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
            // 重新排列瀑布流
            this.tunnels = [100, 100, 100]
            for (var i = 0; i < this.photo.length; i++) {
              if (this.Img.deleteImg.indexOf(i) < 0) {
                this.imgLoad(i)
              }
            }
          })
      }).catch(() => {
        // 取消后进行的操作
      })
    },
    // 上传至七牛云，非本地存储
    // 使用表单方式 (formdata) 提交可提交文件类型
    // uploadQiniu (param) {
    //   const config = {
    //     headers: {'Content-Type': 'multipart/form-data'}
    //   }
    //   let filetype = ''
    //   if (param.file.type === 'image/png') {
    //     filetype = 'png'
    //   } else {
    //     filetype = 'jpg'
    //   }
    //   // 重命名要上传的文件
    //   const keyname = 'fwb' + Date.parse(new Date()) + Math.floor(Math.random() * 100) + '.' + filetype
    //   // 从后端获取上传凭证token
    //   this.axios.get('http://47.103.15.224:8080/api/album/upload').then(res => {
    //     console.log(res.data.upToken)
    //     const formdata = new FormData()
    //     formdata.append('file', param.file)
    //     formdata.append('token', res.data.upToken)
    //     formdata.append('key', keyname)
    //     // 获取到凭证之后再将文件上传到七牛云空间
    //     this.axios.post(this.qiniu.domain, formdata, config).then(res => {
    //       this.imageUrl = 'http://' + this.qiniu.qiniuaddr + '/' + res.data.key
    //     })
    //   })
    // },
    // 上传模块,上传至远程服务器
    // http-request 默认回调参数为 param
    uploadPhoto (param) {
      this.$confirm('是否上传此图片', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var reader = new FileReader()
        // 读取文件并为 result 属性编码 base64
        reader.readAsDataURL(param.file)
        // 限制文件大小
        if (param.file.size > 1024 * 1024) {
          this.$message.error('文件超出大小限制')
          this.$refs.upload.clearFiles()
        } else {
          reader.onload = e => {
            this.formInline.img = e.target.result
            this.axios.post('http://47.103.15.224:8080/api/album', {
              photo: this.formInline.img,
              name: param.file.name
            })
              .then(response => {
                this.err_code = response.data.err_code
                this.correct_code = response.data.correct_code
                this.lazyLoad()
                // 重置已被删除的列表
                this.deleteImg = []
              })
          }
        }
      }).catch(() => {
        this.$refs.upload.clearFiles()
      })
    },
    // 无验证码
    open () {
      this.buttonVisible = true
      // 需要减去浏览器滚动条的宽度：17 px , window.innerWidth 为浏览器宽度加上滚动条的宽度
      this.browserWidth = window.innerWidth - 17
      // this.showPhoto()
      this.lazyLoad()
      // 检测浏览器大小变化
      window.onresize = () => {
        return (() => {
          this.browserWidth = window.innerWidth - 17
        })()
      }
      window.onscroll = () => {
        if (!this.isLazyLoad) {
          this.lazyLoad()
        }
      }
      this.imgStyle.width = this.browserWidth / 3 - 20 + 'px'
    },
    // 验证码模块
    // open () {
    //   this.$prompt('请输入验证码', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(({ value }) => {
    //     if (value === '1314') {
    //       this.buttonVisible = true
    //       // 需要减去浏览器滚动条的宽度：17 px , window.innerWidth 为浏览器宽度加上滚动条的宽度
    //       this.browserWidth = window.innerWidth - 17
    //       // this.showPhoto()
    //       this.lazyLoad()
    //       // 检测浏览器大小变化
    //       window.onresize = () => {
    //         return (() => {
    //           this.browserWidth = window.innerWidth - 17
    //         })()
    //       }
    //       window.onscroll = () => {
    //         if (!this.isLazyLoad) {
    //           this.lazyLoad()
    //         }
    //       }
    //       this.imgStyle.width = this.browserWidth / 3 - 20 + 'px'
    //     } else {
    //       this.$message.error('验证码错误')
    //       this.open()
    //     }
    //   }).catch(() => {
    //     window.location.href = 'http://47.103.15.224:8080/'
    //   })
    // },
    // 瀑布流模块
    imgLoad (index) {
      this.definition()
      let smallIndex = this.indexOfSmallest(this.tunnels)
      // 控制图片间隔
      let photoDistance = 15 - smallIndex * 5
      // 具体实现方法
      this.Img.baseImg[index].style.width = this.browserWidth / 3 - 20 + 'px'
      this.Img.imgDiv[index].style.width = this.Img.baseImg[index].style.width
      let imgHeight = this.Img.baseImg[index].offsetHeight
      this.Img.imgDiv[index].style.left = this.browserWidth / 3 * smallIndex + photoDistance + 'px'
      this.Img.imgDiv[index].style.top = this.tunnels[smallIndex] + 'px'
      this.tunnels[smallIndex] += 130 + imgHeight
      this.selfAdaption(index)
      // 循环到最后一场
      if (index + 1 === this.photo.length) {
        // 检测滚动条
        if (this.detectScrollbar() === true) {
          this.browserWidth = window.innerWidth - 17
        }
      }
    },
    indexOfSmallest (a) {
      var lowest = 0
      for (let i = 1; i < a.length; i++) {
        if (a[i] < a[lowest]) lowest = i
      }
      return lowest
    },
    // 元素定义
    definition () {
      this.Img.baseImg = document.getElementsByClassName('baseImg')
      this.Img.imgDiv = document.getElementsByClassName('imgDiv')
      this.Img.imgName = document.getElementsByClassName('imgName')
      this.Img.imgButtons.imgButton1 = document.getElementsByClassName('imgButton1')
      this.Img.imgButtons.imgButton2 = document.getElementsByClassName('imgButton2')
      this.Img.imgButtons.imgButton3 = document.getElementsByClassName('imgButton3')
    },
    selfAdaption (index) {
      // 实现字体自适应
      this.Img.imgName[index].style.fontSize = window.innerWidth / 60 + 'px'
      // 实现按钮大小自适应
      this.Img.imgButtons.imgButton1[index].style.marginTop = 15 - window.innerWidth / 120 + 'px'
      this.Img.imgButtons.imgButton2[index].style.marginTop = 15 - window.innerWidth / 120 + 'px'
      this.Img.imgButtons.imgButton3[index].style.marginTop = 15 - window.innerWidth / 120 + 'px'
      this.Img.imgButtons.imgButton1[index].style.marginLeft = window.innerWidth / 17 + 'px'
      this.Img.imgButtons.imgButton2[index].style.marginLeft = window.innerWidth / 15 + 'px'
      this.Img.imgButtons.imgButton3[index].style.marginLeft = window.innerWidth / 15 + 'px'
      this.Img.imgButtons.imgButton1[index].style.fontSize = window.innerWidth / 60 + 'px'
      this.Img.imgButtons.imgButton2[index].style.fontSize = window.innerWidth / 60 + 'px'
      this.Img.imgButtons.imgButton3[index].style.fontSize = window.innerWidth / 60 + 'px'
    },
    // 检测滚动条是否存在
    detectScrollbar () {
      let biggest = this.indexOfBiggest(this.tunnels)
      if (this.tunnels[biggest] > document.body.clientHeight) return true
      return false
    },
    indexOfBiggest (a) {
      let biggest = 0
      for (let i = 1; i < a.length; i++) {
        if (a[i] > a[biggest]) biggest = i
      }
      return biggest
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.open()
    // 重新显示滚动条
    document.body.parentNode.style.overflowY = 'auto'
    // 隐藏 X 轴滚动条
    document.body.parentNode.style.overflowX = 'hidden'
    // 背景置为浅灰色
    document.body.parentNode.style.background = '#A8A8A8'
  }
}
</script>

<style scoped>
.head {
  /* 使 div 元素叠在一行 */
  /* display: flex; */
  width: 100%;
}
.album {
  height: 100%;
  width: 100%;
}
.imgDiv {
  position: absolute;
  /* 取消元素间间隔 */
  font-size: 0px;
}
.imgName {
  padding-top: 10px;
  display: flex;
  justify-content: center;
}
.baseImg {
  /* 鼠标变手型 */
  cursor: pointer;
}
.uploadButton {
  width: 10%;
  border-radius: 50px;
  /* 居中 */
  position: absolute;
  margin: auto;
  left: 0px;
  right: 0px;
  top: 30px;
}
.imgDiscribe {
  height: 100px;
  font-size: 12px;
  background-color: white;
}
</style>
