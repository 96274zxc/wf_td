<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>上传头像</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="avaterForm">
                    <el-input disabled v-model="avaterForm.avater" v-show="false"></el-input>
                    <el-upload action="http://localhost/admin/upload" :on-preview="handlePreview" :on-remove="handleRemove" 
                    list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                        <el-button size="small" type="primary" multiple="false" :disabled="uploadButton" v-show="uploadButton3">点我上传头像</el-button> (#^.^#)
                    </el-upload>
                    <el-button class="avater-button" size="small" type="primary" multiple="false" v-show="uploadButton2" @click="avaterUpload">确认上传</el-button>
            </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 图片上传组件的headers请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            uploadButton: false,
            uploadButton2: false,
            uploadButton3: true,
            avaterForm: {
                avater: ''
            }
        }
    },
    methods: {
        handlePreview() {
        },
        // 处理移除图片的操作
        handleRemove(file) {
            // console.log(file);
            this.avaterForm.avater = ''
            this.uploadButton = false
            this.uploadButton2 = false
            this.uploadButton3 = true
        },
        // 监听图片上传成功的事件
        handleSuccess(response) {
            // console.log(response);
            this.avaterForm.avater = response.path
            this.uploadButton = true
            this.uploadButton2 = true
            this.uploadButton3 = false
        },
        async avaterUpload() {
            const {data: res} = await this.$http.post('/admin/avater', this.avaterForm)
            // console.log(res);
            if (res.meta.status !== 201) return this.$message.error('头像上传失败！')
            this.$message.success('头像上传成功！')
            setTimeout(function() {
            location.reload()
            }, 500)
        }
    }
}
</script>

<style lang="less" scoped>
.avater-button {
    margin-top: 10px;
}
</style>