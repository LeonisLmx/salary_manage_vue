<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header style="height: 50px">

            <p style="margin-left: 80px;font-weight: 700;font-size: 20px;">薪资管理系统</p>
            <el-dropdown class="right">
                <span class="el-dropdown-link">
                 个人中心<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="openUserData">个人资料</el-dropdown-item>
                    <el-dropdown-item @click.native="openEditPassword">修改密码</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="avatar">
                <el-avatar v-if="imageUrl == null" style="font-size: 18px" size="medium"> {{$store.state.user.name.charAt(0)}}
                </el-avatar>
                <el-avatar v-else :src="imageUrl" size="medium">
                </el-avatar>
            </div>
            <el-button type="info" size="mini" @click="logout">注销</el-button>
        </el-header>
        <!-- 页面主体区域-->
        <el-container>
            <!--  侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">
                    <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
                </div>
                <!--   侧边栏菜单区域-->
                <el-menu background-color="#1f1f1f"
                         text-color="#fff"
                         active-text-color="#eee" unique-opened
                         :collapse="isCollapse"
                         :collapse-transition="false"
                         :router="true">
                    <!-- 一级菜单-->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <!--一级菜单的模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="item.icon"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="subItem.path+''" v-for="subItem in item.children" :key="subItem.id"
                                      :class="$route.path===subItem.path?'is-active':''">
                            <template slot="title">
                                <i :class="subItem.icon"></i>
                                <span>{{subItem.name}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main>
                <router-view/>
                <el-dialog
                        title="个人资料"
                        :visible.sync="userDataDialog"
                        width="30%"
                >
                    <el-upload
                            class="avatar-uploader"
                            :action="url"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="updateAvatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-form style="margin-top:60px">
                        <el-form ref="userDataRef" :model="userData" :rules="userDataRules" label-width="80px">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="userData.username" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="userData.name" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="当前角色">
                                <el-input v-model="userData.roleName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="联系方式" prop="phone">
                                <el-input v-model="userData.phone" ></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="userData.email" ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                     <el-button @click="userDataDialog = false">取 消</el-button>
                     <el-button type="primary" @click="userDataDialog = false">确 定</el-button>
                    </span>
                </el-dialog>


                <el-dialog
                        title="修改密码"
                        :visible.sync="userEditPasswordDialog"
                        width="30%"
                >
                    <el-form style="margin-top:60px">
                        <el-form :model="userPasswordData" :rules="userPasswordDataRules" label-width="80px">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="userPasswordData.username" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="userPasswordData.name" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="userPasswordData.password"></el-input>
                            </el-form-item>
                            <el-form-item label="密码确认" prop="passwordConfirm">
                                <el-input v-model="userPasswordData.passwordConfirm" ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                     <el-button @click="userDataDialog = false">取 消</el-button>
                     <el-button type="primary" @click="userDataDialog = false">确 定</el-button>
                    </span>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import {Message, MessageBox, Notification} from 'element-ui'
    import image from '@/assets/avatar.png';
    export default {
        data() {
            return {
                menuList: [],
                avatarImgSrc: image,
                isCollapse: false,
                infoDialog: false,
                display: 'none',
                userDataDialog:false,
                userData:{},
                userPasswordData: {},
                url:'/employee/upload/'+this.$store.state.user.id,
                userDataRules:{
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur"}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur"}],
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入您的联系方式', trigger: 'blur'},
                        { min: 11, max: 11, message: "格式错误", trigger: "blur"}],
                    email: [{required: true, message: '请输入您的邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}]
                },
                userPasswordDataRules: {
                    password: [{required: true, message: '请输入您的密码', trigger: 'blur'}],
                    passwordConfirm: [{required: true, message: '请再次输入您的密码', trigger: 'blur'}]
                },
                imageUrl: this.$store.state.user.userface,
                userEditPasswordDialog: false
            }
        },
        created() {
            this.getMenuList();
        },

        methods: {
            logout() {
                MessageBox.confirm('是否注销登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //清除session中的数据，跳转
                    const res=this.$http.get('/logout');
                    if (res){
                        window.sessionStorage.clear();
                        await this.$router.push('/login');
                    }
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消操作'
                    });
                    return;
                });

            },
            async getMenuList() {
                const res = await this.$http.get('/menuList')
                this.menuList = res.obj
            },
            //打开用户资料对话框
            openUserData() {
                this.userDataDialog = true;
                this.userData = this.$store.state.user;
            },
            openEditPassword() {
                this.userEditPasswordDialog = true;
                this.userPasswordData = this.$store.state.user;
                this.userPasswordData.password = '';
            },
            //点击按钮实现折叠展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            handleAvatarSuccess(res, file) {
                if (res){
                    this.imageUrl = res.obj;
                    this.$store.commit('changeUserFace',this.imageUrl);
                    this.imageUrl = this.$store.state.user.userface;
                    Message.success(res.msg)
                }

            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    Message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    Message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }


        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        color: #F6F6F6;
        background-color: #0C61B8;
        display: flex;
        justify-content: space-between;
        padding-left: 0px; //距离左边的距离
        align-items: center;

        .el-button {
            position: absolute;
            right: 20px;
        }

        .right {
            position: absolute;
            right: 90px;
        }

        .avatar {
            display: flex;
            align-items: center;
            position: absolute;
            left: 10px;
        }

    }

    .el-aside {
        background-color: #1f1f1f;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #DCDFE6;
        color: #303133;
    }

    .toggle-button {
        left: 200px;
        background-color: #DCDFE6;
        font-size: 20px;
        line-height: 24px;
        color: black;
        text-align: center;
        cursor: pointer;
    }

    .el-dropdown-link {
        color: #eeeeee;
    }

    .font {
        height: 60px;
        width: 200px;
        display: flex;
        align-items: center;
        >img {
            width: 100%;
            height: 100%;
            background-color: #24394E;

        }
    }
    .avatar-uploader .el-upload {
        width: 100px;
        height: 100px;
        border: 1px solid #909399;
        cursor: pointer;
        overflow: hidden;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);

    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        border: 1px solid #909399;
        border-radius: 50%;
        line-height: 100px;
        text-align: center;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .updateAvatar {
        width: 100px;
        height: 100px;
        display: block;
        border: 1px solid #909399;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .el-avatar{
        >img {
            display: block;
            height: auto;
            width: 100%;
            vertical-align: middle;
        }
    }

</style>
