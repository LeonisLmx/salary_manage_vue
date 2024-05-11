<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>薪资管理</el-breadcrumb-item>
            <el-breadcrumb-item>薪资列表</el-breadcrumb-item>
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
            </el-row>

            <!--用户列表区域  -->
            <el-table v-loading="loading"
                      :data="userList"
                      border
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="进入公司时间" prop="workInCompanyTime">
                    <template slot-scope="scope">
                        {{ parseTime(scope.row.workInCompanyTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="公司工龄(天)" prop="workInCompanyDays"></el-table-column>
                <el-table-column label="单日工资" prop="salary"></el-table-column>
                <el-table-column label="工资发放最短时长" prop="payDuration"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="openEditUser(scope.row)"></el-button>
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
        
            <!--修改对话框-->
            <el-dialog
                    title="修改用户薪资"
                    :visible.sync="editDialogVisible"
                    width="50%">
                <el-form ref="editUserRef" :model="editUser" :rules="addFormRules" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="editUser.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="单日工资" prop="salary">
                        <el-input v-model="editUser.salary"></el-input>
                    </el-form-item>
                    <el-form-item label="工资天数" prop="payDuration">
                        <el-input v-model="editUser.payDuration"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
               <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserYes">确 定</el-button>
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
                //添加表单的验证规则对象
                addFormRules: {
                    salary: [{required: true, message: '请输入员工薪资', trigger: 'blur'}],
                },
                //修改用户对话框
                editDialogVisible: false,
                editUser: {
                    id: 1,
                    username: '',
                    salary: '',
                },
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
            //监听添加用户对话框关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
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
            parseTime(val) {
                return this.exchangeTime(val)
            },
            exchangeTime(time) {
                var date = new Date(time);  // 参数需要毫秒数，所以这里将秒数乘于 1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ":";
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ":" : date.getMinutes() + ':';
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y+M+D+h+m+s
            },
            openEditUser(row) {
                this.editDialogVisible = true
                this.editUser = row
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
