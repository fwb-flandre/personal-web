import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import hello from '@/components/hello'
import collector from '@/components/collector'
import album from '@/components/album'
import study from '@/components/study'
import selectExclude from '@/components/selectExclude'
import backstage from '@/components/backstage'
import backstageWrite from '@/components/backstage/write'
import backstageManage from '@/components/backstage/manage'
import backstageEdit from '@/components/backstage/edit'
import blog from '@/components/blog'
import blogIndex from '@/components/blog/blogIndex'
import blogClassify from '@/components/blog/classify'
import blogClassifyArticle from '@/components/blog/classifyArticle'
import blogAbout from '@/components/blog/about'
import blogArticle from '@/components/blog/article'
import blogList from '@/components/blog/list'
import detect from '@/components/detect'
import detectOverview from '@/components/detect/overview'
import detectManage from '@/components/detect/manage'
import detectPersonal from '@/components/detect/personal'

// 禁止全局路由错误处理打印
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  // history 用于删除在地址后自动添加的 # 号问题
  // mode: 'history',
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/hello',
      name: 'hello',
      component: hello
    },
    {
      path: '/collector',
      name: 'collector',
      component: collector
    },
    {
      path: '/album',
      name: 'album',
      component: album
    },
    {
      path: '/study',
      name: 'study',
      component: study
    },
    {
      path: '/selectExclude',
      name: 'selectExclude',
      component: selectExclude
    },
    {
      path: '/backstage',
      name: 'backstage',
      component: backstage,
      children: [
        {
          path: '/backstage/write',
          name: 'backstageWrite',
          component: backstageWrite
        },
        {
          path: '/backstage/manage',
          name: 'backstageManage',
          component: backstageManage
        },
        {
          path: '/backstage/edit:articleID',
          name: 'backstageEdit',
          component: backstageEdit
        }
      ]
    },
    {
      path: '/blog',
      name: 'blog',
      component: blog,
      children: [
        {
          path: '/blog/blogIndex',
          name: 'blogIndex',
          component: blogIndex
        },
        {
          path: '/blog/about',
          name: 'blogAbout',
          component: blogAbout
        },
        {
          path: '/blog/article/:articleID',
          name: 'blogArticle',
          component: blogArticle
        },
        {
          path: '/blog/list',
          name: 'blogList',
          component: blogList
        },
        {
          path: '/blog/classify',
          name: 'blogClassify',
          component: blogClassify
        },
        {
          path: '/blog/classifyArticle/:classifyType',
          name: 'blogClassifyArticle',
          component: blogClassifyArticle
        }
      ]
    },
    {
      path: '/detect',
      name: 'detect',
      component: detect,
      children: [
        {
          path: '/detect/overview',
          name: 'detectOverview',
          component: detectOverview,
          children: [
            {
              path: '/detect/overview/manage',
              name: 'detectManage',
              component: detectManage
            },
            {
              path: '/detect/overview/personal',
              name: 'detectPersonal',
              component: detectPersonal
            }
          ]
        }
      ]
    }
  ]
})
