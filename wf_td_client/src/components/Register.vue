<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo_wf.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 邮箱 -->
                <el-form-item prop="email">
                    <el-input v-model="loginForm.email" prefix-icon="el-icon-message" placeholder="请输入您的邮箱"></el-input>
                </el-form-item>
                <!-- 昵称 -->
                <el-form-item prop="nickname">
                    <el-input v-model="loginForm.nickname" prefix-icon="el-icon-user-solid" placeholder="请输入您的昵称"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="register">点我注册</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
                <a href="javascript:;" class="login" @click="login">已有账号？点我登录</a>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rules, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                email: '',
                nickname: '',
                password: ''
            },
            // 这是表单的验证规则对象
            loginFormRules: {
                // 验证用户名是否合法
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },                  
                    {validator: checkEmail, trigger: 'blur'}        
                ],
                // 验证昵称是否合法
                nickname: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                    { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入6~16位长度的密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        register() {
            this.$refs.loginFormRef.validate(async valid => {
            const res = await this.$http.post('/admin/register', this.loginForm)
            // console.log(res);
            if (res.status === 202) return this.$message.error('注册失败，该邮箱已被注册')
            if (res.status === 203) return this.$message.error('注册失败，该用户名已被注册')
            // console.log(res);
            this.$message.success('注册成功，请登录！')
            this.$router.push('/login')
            })
        },
        login() {
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
.login {
    position: absolute;
    top: 231px;
    right: 20px;
    font-size: 14px;
}
</style>
