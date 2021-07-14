<template>
        <el-container class="home-container">
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <img class="avater" :src="avaterPath" alt="">
                    <span>{{currentUserName}} 欢迎您！</span>
                </div>
                <div>
                <el-button type="danger" @click="toIndex">前往市场</el-button>
                <el-button type="info" @click="logout">退出登录</el-button>
                </div>
            </el-header>
            <!-- 页面主体区域 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle-button" @click="toggleCollapse">|||</div>
                    <!-- 侧边栏菜单区域 -->
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse="isCollapse" :collapse-transition="false" 
                    router :default-active="activePath">
                        <!-- 一级菜单 -->
                        <el-submenu :index="'1'">
                            <!-- 一级菜单的模板区域 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-user-solid"></i>
                                <!-- 文本 -->
                                <span>个人中心</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item v-if="currentUserRole == 'admin'" :index="'/user'" @click="saveNavState('/user')">
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-user"></i>
                                    <!-- 文本 -->
                                    <span>查看用户</span>
                                </template>
                            </el-menu-item>
                            <el-menu-item :index="'/avater'" @click="saveNavState('/avater')">
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-picture-outline-round"></i>
                                    <!-- 文本 -->
                                    <span>上传头像</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                        <!-- 一级菜单 -->
                        <el-submenu :index="'2'">
                            <!-- 菜单的模板区域 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-shopping-bag-1"></i>
                                <!-- 文本 -->
                                <span>商品管理</span>
                            </template>
                            <el-menu-item v-if="currentUserRole == 'admin'" :index="'/mod'" @click="saveNavState('/mod')">
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-shopping-bag-2"></i>
                                    <!-- 文本 -->
                                    <span>添加新物品</span>
                                </template>
                            </el-menu-item>
                            <el-menu-item :index="'/sale'" @click="saveNavState('/sale')">
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-sell"></i>
                                    <!-- 文本 -->
                                    <span>发布商品</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 右侧内容主体 -->
                <el-main>
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: '',
            currentUserName: '',
            currentUserRole: '',
            cunrrentUserAvater: '',
            avaterPath: 'http://localhost/uploads/9561163fc94665ce0216e12937a21633.jpg'
        }
    },
    async created() {
        this.activePath = window.sessionStorage.getItem('activePath')
        const { data:res } = await this.$http.get('/admin/getusername')
        const { data:result } = await this.$http.get('/admin/getavater')
        // console.log(res);
        // 当前用户登录名为 currentUN.data
        this.currentUserName = res.data.usernickname
        this.currentUserRole = res.data.userrole
        this.cunrrentUserAvater = result.avatar
        this.avaterPath = 'http://localhost' + this.cunrrentUserAvater
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/index')
            this.$message.success('您已退出登录！')
        },
        // 点击按钮，切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        },
        toIndex() {
            this.$router.push('/index')
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    display: flex;
    background-color: #373d41;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
.avater {
    border-radius: 50%;
    width: 59px;
    height: 59px;
}
</style>
