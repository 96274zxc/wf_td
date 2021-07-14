<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="输入昵称搜索用户" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <!-- <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col> -->
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="昵称" prop="nickName"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="头像" prop="avatar">
                    <template slot-scope="scope">
                　　　　<img :src="'http://localhost' + scope.row.avatar" width="36" height="36"/>
                　　</template>
                </el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="最后登录时间" prop="loginTime">
                    <template slot-scope="scope">
                        {{scope.row.loginTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[4, 6, 8, 10]" 
            :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 4
            },
            userlist: [],
            total: 0
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const {data: res} = await this.$http.get('/admin/user', {params: this.queryInfo})
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
            this.userlist = res.user
            this.total = res.total
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听 switch 开关状态的改变
        async userStateChanged(userinfo) {
            // console.log(userinfo);
            const res = await this.$http.put(`admin/user/${userinfo.email}/state/${userinfo.state}`)
            // console.log(res);
            if (res.status !== 200) {
                userinfo.state = !userinfo.state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
        }
    }
}
</script>

<style lang="less" scoped>
</style>