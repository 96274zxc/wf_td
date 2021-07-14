<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>发布商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请搜索商品名称" v-model="queryInfo.query" clearable @clear="getSalelist">
                        <el-button slot="append" icon="el-icon-search" @click="getSalelist"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">发布商品</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="salelist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="sale.mod"></el-table-column>
                <el-table-column label="缩略图" prop="thumbnail">
                    <template slot-scope="scope">
                　　　　<img :src="'http://localhost' + scope.row.sale.thumbnail" width="48" height="72"/>
                　　</template>
                </el-table-column>
                <el-table-column label="商品价格" prop="price"></el-table-column>
                <el-table-column label="商品数量" prop="quantity"></el-table-column>
                <el-table-column label="商品等级" prop="rank"></el-table-column>
                <el-table-column label="发布时间" prop="publishTime">
                    <template slot-scope="scope">
                        {{scope.row.publishTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.sale._id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeSale(scope.row._id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[4, 6, 8, 10]" 
            :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加商品的对话框 -->
        <el-dialog title="添加商品" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="80px">
                <el-form-item label="商品名称" prop="sale">
                    <el-input v-model="addForm.sale"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input v-model.number="addForm.price" placeholder="1~999"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="quantity">
                    <el-input v-model.number="addForm.quantity" placeholder="1~99"></el-input>
                </el-form-item>
                <el-form-item label="商品等级" prop="rank">
                    <el-input v-model.number="addForm.rank" placeholder="0~8"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSale">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑商品的对话框 -->
        <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="80px">
                <el-form-item label="商品名称" prop="sale">
                    <el-input v-model="editForm.sale" disabled></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input v-model.number="editForm.price" placeholder="1~999"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="quantity">
                    <el-input v-model.number="editForm.quantity" placeholder="1~99"></el-input>
                </el-form-item>
                <el-form-item label="商品等级" prop="rank">
                    <el-input v-model.number="editForm.rank" placeholder="0~8"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSale">确 定</el-button>
            </span>
        </el-dialog>
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
                pagesize: 4
            },
            salelist: [],
            total: 0,
            // 控制添加商品对话框的显示与隐藏
            addDialogVisible: false,
            // 控制修改商品对话框的显示与隐藏
            editDialogVisible: false,
            // 添加商品的表单数据
            addForm: {
                sale: '',
                price: '',
                quantity: 1,
                rank: 0
            },
            // 查询到的商品信息对象
            editForm: {},
            // 添加表单的验证规则对象
            addFormrules: {
                sale: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                    {min: 3, max: 30, message: '商品名称不小于3个字符', trigger: 'blur'}
                ],
                price: [
                    {required: true, message: '请输入商品价格', trigger: 'blur'},
                    {type: 'number', message: '价格必须为数字', trigger: 'blur'},
                    { pattern: /^([1-9]|[1-9]\d|1\d\d|2\d\d|3\d\d|4\d\d|5\d\d|6\d\d|7\d\d|8\d\d|9\d\d)$/, message: '范围在0-999',trigger: 'blur'}
                ],
                quantity: [
                    {required: true, message: '请输入商品数量', trigger: 'blur'},
                    {type: 'number', message: '数量必须为数字', trigger: 'blur'},
                    { pattern: /^([1-9]|[1-9]\d)$/, message: '范围在1-99',trigger: 'blur'}
                ],
                rank: [
                    {required: true, message: '请输入商品等级', trigger: 'blur'},
                    {type: 'number', message: '等级必须为数字', trigger: 'blur'},
                    { pattern: /^([0-8])$/, message: '范围在0-8',trigger: 'blur'}
                ]
            },
            editFormrules: {
                sale: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                    {min: 3, max: 30, message: '商品名称不小于3个字符', trigger: 'blur'}
                ],
                price: [
                    {required: true, message: '请输入商品价格', trigger: 'blur'},
                    {type: 'number', message: '价格必须为数字', trigger: 'blur'},
                    { pattern: /^([1-9]|[1-9]\d|1\d\d|2\d\d|3\d\d|4\d\d|5\d\d|6\d\d|7\d\d|8\d\d|9\d\d)$/, message: '范围在0-999',trigger: 'blur'}
                ],
                quantity: [
                    {required: true, message: '请输入商品数量', trigger: 'blur'},
                    {type: 'number', message: '数量必须为数字', trigger: 'blur'},
                    { pattern: /^([1-9]|[1-9]\d)$/, message: '范围在1-99',trigger: 'blur'}
                ],
                rank: [
                    {required: true, message: '请输入商品等级', trigger: 'blur'},
                    {type: 'number', message: '等级必须为数字', trigger: 'blur'},
                    { pattern: /^([0-8])$/, message: '范围在0-8',trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getSalelist()
    },
    methods: {
        async getSalelist() {
            const {data: res} = await this.$http.get('/admin/sale', {params: this.queryInfo})
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
            this.salelist = res.sale
            this.total = res.total
            // console.log(this.salelist);
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getSalelist()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getSalelist()
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 监听编辑用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮，添加发布商品
        addSale() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起添加发布商品请求
                const { data:res } = await this.$http.post('/admin/sale', this.addForm)
                // console.log(res);
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.$message.success('发布商品成功！')
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getSalelist()
            })
        },
        // 展示编辑商品的对话框
        async showEditDialog(sale) {
            this.editDialogVisible = true
            // console.log(sale);
            const { data: res } = await this.$http.get('/admin/sale/'+ sale)
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('查询物品失败！') 
            this.editForm = res.data
            const { data: result } = await this.$http.get('/admin/sale/modname/'+ this.editForm.sale)
            // console.log(result);
            this.editForm.sale = result.data.mod;
        },
        // 编辑商品信息并提交
        editSale() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起编辑物品请求
                // console.log(this.editForm);
                const { data:res } = await this.$http.put('/admin/sale/'+ this.editForm._id, {
                    price: this.editForm.price,
                    quantity: this.editForm.quantity,
                    rank: this.editForm.rank
                })
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error('修改物品失败！')
                this.$message.success('修改物品成功！')
                // 隐藏添加用户的对话框
                this.editDialogVisible = false
                // 重新获取用户列表数据
                this.getSalelist()
            })
        },
        // 删除物品
        async removeSale(_id) {
            // console.log(_id);
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将删除该物品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消删除，则返回值为字符串 cancel
            if (confirmResult !== 'confirm') {
                return this.$message.info('取消删除')
            }
            const { data:res } = await this.$http.delete('/admin/sale/'+ _id)
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error('删除物品失败！')
                this.$message.success('删除物品成功！')
                // 重新获取用户列表数据
                this.getSalelist()
        }
    }
}
</script>

<style lang="less" scoped>
</style>