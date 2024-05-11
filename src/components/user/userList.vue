<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <!--搜索与添加区域-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              v-model="queryInfo.query"
                              clearable
                              @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-col>
            </el-row>

            <!--用户列表区域  -->
            <el-table v-loading="loading"
                      :data="userList"
                      border
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="角色" prop="roleName"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!--  {{scope.row}}-->
                        <el-switch v-model="scope.row.enabled" @change="userEnabledChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="openEditUser(scope.row)"></el-button>
                        <!--删除-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="deleteUser(scope.row.id)"></el-button>
                        <!--分配角色-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                            @click="openAssRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[2, 5, 7, 10]"
                    :page-size="queryInfo.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
            <!--添加对话框-->
            <el-dialog
                    title="添加用户"
                    :visible.sync="dialogVisible"
                    width="30%"
                    @close="addDialogClosed">
                <!--内容主体区域-->
                <el-form
                        :model="addForm"
                        :rules="addFormRules"
                        ref="addFormRef"
                        label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model="addForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="单日薪资" prop="salary">
                        <el-input v-model="addForm.salary"></el-input>
                    </el-form-item>
                    <el-form-item label="薪资周期" prop="payDuration">
                        <el-input v-model="addForm.payDuration"></el-input>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserYes">确 定</el-button>
                </span>

            </el-dialog>
            <!--修改对话框-->
            <el-dialog
                    title="修改用户"
                    :visible.sync="editDialogVisible"
                    width="50%">
                <el-form ref="editUserRef" :model="editUser" :rules="addFormRules" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="editUser.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="editUser.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editUser.email"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
               <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserYes">确 定</el-button>
                </span>

            </el-dialog>
            <!-- 分配角色对话框-->
            <el-dialog
                    title="分配角色"
                    :visible.sync="assRoleDialogVisible"
                    width="50%">
                <div>
                    <p>当前用姓名:{{userInfo.name}}</p>
                    <p>当前用角色:{{userInfo.roleName}}</p>
                    <p>选择新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                                v-for="item in allRole"
                                :label="item.nameZh"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="assRoleDialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="assRoleYes">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {MessageBox, Message} from 'element-ui'

    export default {
        data() {
            return {
                queryInfo: {
                    query: '',
                    pageNum: 1,
                    //当前每页显示多少条数据
                    size: 7
                },
                dialogVisible: false,
                userList: [],
                total: 1,
                loading: false,
                //添加用户的表单数据
                addForm: {
                    username: '',
                    password: '',
                    name: '',
                    phone: '',
                    email: '',
                    enabled: true,
                    userfase: '',
                    role_name: '',
                    remark: ''

                },
                //添加表单的验证规则对象
                addFormRules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur"}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur"}],
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入联系方式', trigger: 'blur'},
                        { min: 11, max: 11, message: "格式错误", trigger: "blur"}],
                    email: [{required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},],
                    salary: [{required: true, message: '请输入员工薪资', trigger: 'blur'}],
                    payDuration: [{required: true, message: '请输入薪资周期', trigger: 'blur'}]
                },
                //修改用户对话框
                editDialogVisible: false,
                editUser: {
                    id: 1,
                    username: '',
                    phone: '',
                    emil: '',
                },
                //分配角色
                assRoleDialogVisible:false,
                allRole:[],
                selectedRoleId:'',
                userInfo:{},
                //分配角色loading
                // assRoleLoading:false
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            //获取用户列表
            async getUserList() {
                this.loading = true
                const res = await this.$http.get('/employee/userList/', {params: this.queryInfo})
                if (!res) return;
                if (res) {
                    this.userList = res.obj.data;
                    this.total = res.obj.total;
                }
                this.loading = false
            },
            //分页每页条数
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getUserList()
            },
            //当前也数
            handleCurrentChange(newPage) {
                this.queryInfo.pageNum = newPage;
                this.getUserList();
            },
            //改变状态
            async userEnabledChanged(userInfo) {
                const res = await this.$http.put('/employee/updateEnabled/' + userInfo.id + '/' + userInfo.enabled);
                if (!res) {
                    userInfo.enabled = !userInfo.enabled
                }
            },

            addUser() {
                this.dialogVisible = true
            },
            //监听添加用户对话框关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
            },
            addUserYes() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const res = await this.$http.post('/employee/addUser/', this.addForm);
                    // console.log(res);
                    if (!res) return;
                    this.dialogVisible = false;
                    this.getUserList();

                })
            },
            openEditUser(editUser) {
                this.editDialogVisible = true;
                this.editUser = editUser;
            },
            editUserYes() {
                this.$refs.editUserRef.validate(async valid => {
                    if (!valid) return;
                    const res = await this.putRequest('/employee/updateUser', this.editUser);
                    if (!res) return;
                    this.editDialogVisible = false;
                    this.getUserList();
                })
            },
            deleteUser(id) {
                MessageBox.confirm('此操作将永久删除用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.$http.delete('/employee/deleteUser/' + id);
                    if (res){
                        this.getUserList();
                    }
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    return;
                });
            },
            async openAssRole(userInfo){
                this.assRoleDialogVisible=true;
                const res=await this.$http.get('/employee/allRole');
                this.allRole=res.obj;
                this.userInfo=userInfo;
            },
            async assRoleYes(){
                if (!this.selectedRoleId)
                    return Message.error("请选择要分配的角色");
               const res=await this.$http.put('/employee/addUr/'+this.userInfo.id+'/'+this.selectedRoleId);
                if (!res) return ;
                this.assRoleDialogVisible=false;
                this.getUserList();
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
