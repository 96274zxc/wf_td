<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加新物品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getModList">
                        <el-button slot="append" icon="el-icon-search" @click="getModList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加物品</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="modlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="名称" prop="mod"></el-table-column>
                <el-table-column label="缩略图" prop="thumbnail">
                    <template slot-scope="scope">
                　　　　<img :src="'http://localhost' + scope.row.thumbnail" width="48" height="72"/>
                　　</template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createAt">
                    <template slot-scope="scope">
                        {{scope.row.createAt | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" prop="updateAt">
                    <template slot-scope="scope">
                        {{scope.row.updateAt | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.mod)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeMod(scope.row._id)"></el-button>
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
                <el-form-item label="商品名称" prop="mod">
                    <el-input v-model="addForm.mod"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="">
                    <el-input v-model="addForm.thumbnail" disabled></el-input>
                    <el-upload action="http://localhost/admin/upload" :on-preview="handlePreview" :on-remove="handleRemove" 
                    list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                        <el-button size="small" type="primary" multiple="false" :disabled="uploadButton">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMod">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑商品的对话框 -->
        <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="80px">
                <el-form-item label="商品名称" prop="mod">
                    <el-input v-model="editForm.mod"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="">
                    <el-input v-model="editForm.thumbnail" disabled></el-input>
                    <el-upload action="http://localhost/admin/upload" :on-preview="handlePreview" :on-remove="handleRemove" 
                    list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                        <el-button size="small" type="primary" multiple="false" :disabled="uploadButton">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editMod">确 定</el-button>
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
            modlist: [],
            total: 0,
            // 控制添加商品对话框的显示与隐藏
            addDialogVisible: false,
            // 控制修改商品对话框的显示与隐藏
            editDialogVisible: false,
            // 添加商品的表单数据
            addForm: {
                mod: '',
                thumbnail: ''
            },
            // 查询到的商品信息对象
            editForm: {
                mod: '',
                thumbnail: ''
            },
            // 添加表单的验证规则对象
            addFormrules: {
                mod: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                    {min: 3, max: 30, message: '商品名称不小于3个字符', trigger: 'blur'}
                ]
            },
            editFormrules: {
                mod: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                    {min: 3, max: 30, message: '商品名称不小于3个字符', trigger: 'blur'}
                ]
            },
            // 图片上传组件的 headers 请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            uploadButton: false
        }
    },
    created() {
        this.getModList()
    },
    methods: {
        async getModList() {
            const {data: res} = await this.$http.get('/admin/mod', {params: this.queryInfo})
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('获取物品列表失败！')
            this.modlist = res.mod
            this.total = res.total
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
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 监听编辑用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮，添加物品
        addMod() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起添加物品请求
                const { data:res } = await this.$http.post('/admin/mod', this.addForm)
                // console.log(res);
                if (res.meta.status !== 201) return this.$message.error('添加物品失败！')
                this.$message.success('添加物品成功！')
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getModList()
            })
        },
        // 展示编辑商品的对话框
        async showEditDialog(mod) {
            this.editDialogVisible = true
            const { data: res } = await this.$http.get('/admin/mod/'+ mod)
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('查询物品失败！') 
            this.editForm = res.data
        },
        // 编辑商品信息并提交
        editMod() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起编辑物品请求
                // console.log(this.editForm);
                const { data:res } = await this.$http.put('/admin/mod/'+ this.editForm._id, {
                    mod: this.editForm.mod,
                    thumbnail: this.editForm.thumbnail
                })
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error('修改物品失败！')
                this.$message.success('修改物品成功！')
                // 隐藏添加用户的对话框
                this.editDialogVisible = false
                // 重新获取用户列表数据
                this.getModList()
            })
        },
        // 删除物品
        async removeMod(_id) {
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
            const { data:res } = await this.$http.delete('/admin/mod/'+ _id)
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error('删除物品失败！')
                this.$message.success('删除物品成功！')
                // 重新获取用户列表数据
                this.getModList()
        },
        // 处理图片预览效果
        handlePreview() {
        },
        // 处理移除图片的操作
        handleRemove(file) {
            // console.log(file);
            this.addForm.thumbnail = ''
            this.uploadButton = false
        },
        // 监听图片上传成功的事件
        handleSuccess(response) {
            // console.log(response);
            this.addForm.thumbnail = response.path
            this.editForm.thumbnail = response.path
            this.uploadButton = true
        }
    }
}
</script>

<style lang="less" scoped>
</style>