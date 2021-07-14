<template>
    <div>
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请搜索商品" v-model="queryInfo.query" clearable @clear="getAllSalelist" focus>
                        <el-button slot="append" icon="el-icon-search" @click="getAllSalelist"></el-button>
                    </el-input>
                </el-col>
                <el-button type="primary" @click="toLogin" class="loginButton" v-show="denglu">登录</el-button>
                <el-button type="danger" @click="toRegister" v-show="zhuce">注册</el-button>
                <span id="someMsg" v-show="fabu">登录后可以发布商品和发表评论哦</span>
                <el-button type="info" @click="toHome" class="el-icon-s-custom" v-show="geren"> 个人中心</el-button>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="salelist" stripe>
                <el-table-column label="" prop="thumbnail" width="36px">
                    <template slot-scope="scope">
                　　　　<img :src="'http://localhost' + scope.row.seller.avatar" width="28" height="28"/>
                　　</template>
                </el-table-column>
                <el-table-column label="玩家" prop="seller.nickName">
                    <template scope="scope">
                        <div @click="turnToComment(scope.row)" class="nickName">{{ scope.row.seller.nickName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="sale.mod"></el-table-column>
                <el-table-column label="商品" prop="thumbnail">
                    <template slot-scope="scope">
                　　　　<img :src="'http://localhost' + scope.row.sale.thumbnail" width="48" height="72"/>
                　　</template>
                </el-table-column>
                <el-table-column label="" prop="thumbnail" width="21px">
                    <template>
                　　　　<img src="http://localhost/uploads/26px-Platinum64.png" width="12" height="12"/>
                　　</template>
                </el-table-column>
                <el-table-column label="商品价格" prop="price" sortable></el-table-column>
                <el-table-column label="商品数量" prop="quantity"></el-table-column>
                <el-table-column label="商品等级" prop="rank"></el-table-column>
                <el-table-column label="发布时间" prop="publishTime" sortable>
                    <template slot-scope="scope">
                        {{scope.row.publishTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="联系卖家" width="120px">
                    <template slot-scope="scope">
                            <el-button type="primary" plain class="el-icon-document-copy" @click="showCopyMsg(scope.row)" v-clipboard:copy="quickMsg"
                                v-clipboard:success="onCopy" v-clipboard:error="onError"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 8, 10, 15]" 
            :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <div class="footer">欢迎来到warframe交易市场！</div>
        <input type="hidden" v-model="quickMsg">
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取商品列表的参数对象
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 10
            },
            salelist: [],
            total: 0,
            quickMsg: '',
            denglu: true,
            zhuce: true,
            fabu: true,
            geren: true
        }
    },
    created() {
        this.getAllSalelist()
        if (window.sessionStorage.getItem('token') !== null) {
            this.denglu = false, this.zhuce = false, this.fabu = false, this.geren = true
        } else {
            this.denglu = true, this.zhuce = true, this.fabu = true, this.geren = false
        }
    },
    methods: {
        async getAllSalelist() {
            const {data: res} = await this.$http.get('/index', {params: this.queryInfo})
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
            this.salelist = res.sale
            this.total = res.total
            // console.log(this.salelist);
            // this.salelist.publishTime = this.dateFilter(this.salelist.publishTime)
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getAllSalelist()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getAllSalelist()
            window.scrollTo(0,0);
        },
        showCopyMsg(row) {
            this.quickMsg = '/w ' + row.seller.nickName + ' Hi! I want to buy: ' + row.sale.mod + '(rank ' + row.rank + ') for ' + row.price + ' platinum. ———— (该消息来自warframe交易市场)'
            // console.log(this.quickMsg)
            // console.log(row);
        },
        onCopy(e) {
            // console.log("copy arguments e:", e);
            // alert("复制成功!");
            this.$message.success('复制快捷消息成功！')
        },
        onError(e) {
            // console.log("copy arguments e:", e);
            alert("复制快捷消息失败!");
        },
        turnToComment(row) {
            // console.log(row.seller.nickName);
            this.$router.push('/comment?master=' + row.seller.nickName)
        },
        toLogin() {
            this.$router.push('/login')
        },
        toRegister() {
            this.$router.push('/register')
        },
        toHome() {
            this.$router.push('/home')
        }
    }
}
</script>

<style lang="less" scoped>
.footer {
    background-color: #000;
    width: 100%;
    height: 95px;
    color: #fff;
    text-align: center;
    line-height:95px;
    font-size: 24px;
}
.copy-input {
    position: absolute;
    top: 12px;
    left: -620px;
    width: 575px;
    height: 36px;
    font-size: 12px;
}
.nickName {
    cursor: pointer;
}
#someMsg {
    margin-left: 15px;
    color: rgb(0, 0, 0);
    font-size: 14px;
}
.el-icon-s-custom {
    position: absolute;
    right: 20px;
}
</style>