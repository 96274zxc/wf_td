<template>
    <div>
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-button type="primary" @click="toIndex" class="loginButton">返回市场</el-button>
                <span id="someMsg">玩家 {{currentComment}} 所获得的评论</span>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="commentlist" :stripe="false">
                <el-table-column label="" prop="" width="36px">
                    <template slot-scope="scope">
                　　　　<img :src="'http://localhost' + scope.row.author.avatar" width="28" height="28"/>
                　　</template>
                </el-table-column>
                <el-table-column label="评论用户" prop="author.nickName" width="100px">
                </el-table-column>
                <el-table-column label="评论内容" prop="content"></el-table-column>
                <el-table-column label="评论时间" prop="creatAt" width="150px">
                    <template slot-scope="scope">
                        {{scope.row.creatAt | dateFormat}}
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 8, 10, 15]" 
            :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
            <el-input type="textarea" :rows="4" placeholder="评论该玩家" resize="none" maxlength="30" show-word-limit v-model="textarea" class="commentarea">
            </el-input>
            <div class="commentButton">
                <div></div><el-button type="primary" plain @click="createComment">发表评论</el-button>
            </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentUser: '',
            currentComment: '',
            // 获取评论列表的参数对象
            queryInfo: {
                master: '',
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 10
            },
            commentlist: [],
            total: 0,
            textarea: ''
        }
    },
    methods: {
        async getComment() {
            const {data: res} = await this.$http.get('/admin/comment', {params: this.queryInfo})
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('获取评论列表失败！')
            this.commentlist = res.comment
            this.total = res.total
            this.currentComment = this.getUrlKey('master')
            this.currentUser = res.currentUser
        },
        getUrlKey(name){
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getModList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getModList()
        },
        toIndex() {
            this.$router.push('/index')
        },
        async createComment() {
                if (this.textarea.trim() === '') return this.$message.error('评论内容不能为空！')
                const { data:res } = await this.$http.post('/admin/comment', { "comment": this.textarea, "master": this.currentComment})
                // console.log(res);
                if (res.meta.status !== 201) return this.$message.error('添加评论失败！')
                this.$message.success('添加评论成功！')
                this.textarea = ''
                // 重新获取评论列表数据
                this.getComment()
        }
    },
    created() {
            this.queryInfo.master = this.getUrlKey('master')
            // console.log(this.master);
            this.getComment()
    }
}
</script>

<style lang="less" scoped>
#someMsg {
    margin-left: 15px;
}
.commentarea {
    margin-top: 15px;
}
.commentButton {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
}
</style>