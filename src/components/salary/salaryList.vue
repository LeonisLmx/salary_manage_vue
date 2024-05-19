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

            <!--用户列表区域  -->
            <el-table v-loading="loading"
                      :data="userList"
                      border
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="进入公司时间" prop="workInCompanyTime" width="150px">
                    <template slot-scope="scope">
                        {{ parseTime(scope.row.workInCompanyTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="公司工龄(天)" prop="workInCompanyDays"></el-table-column>
                <el-table-column label="每月薪资" prop="salary"></el-table-column>
                <el-table-column label="流支付周期" prop="payDuration"></el-table-column>
                <el-table-column label="流支付单位" prop="payUnit">
                    <template slot-scope="scope">
                        {{ parsePayUnit(scope.row.payUnit)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="openEditUser(scope.row)">修改薪资</el-button>
                        <!--暂停发薪-->
                        <el-button type="danger" icon="el-icon-edit" size="mini" v-if="scope.row.salaryEnabled"
                                   @click="editSalaryAction(scope.row,0)">暂停发薪</el-button>
                        <!--恢复发薪-->
                        <el-button type="success" icon="el-icon-edit" size="mini" v-if="!scope.row.salaryEnabled"
                                   @click="editSalaryAction(scope.row,1)">恢复发薪</el-button>
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
                <el-form ref="editUserRef" :model="editUser" :rules="addFormRules" label-width="100px">
                    <el-form-item label="用户名">
                        <el-input v-model="editUser.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="每月薪资" prop="salary">
                        <el-input v-model="editUser.salary"></el-input>
                    </el-form-item>
                    <el-form-item label="流支付周期" prop="payDuration">
                        <el-input v-model="editUser.payDuration"></el-input>
                    </el-form-item>
                    <el-form-item label="流支付单位" prop="payUnit">
                        <el-select v-model="editUser.payUnit" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
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
                options: [{
                    value: 'DAYS',
                    label: '天'
                }, {
                    value: 'HOURS',
                    label: '小时'
                }, {
                    value: 'MINUTES',
                    label: '分钟'
                }]
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
            },
            editSalaryAction(row, action) {
                var actionMsg = action == 1?'恢复':'关闭'
                MessageBox.confirm('是否确认为 ' + row.name + ' ' + actionMsg + ' 薪资发放功能', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.$http.get('/employee/updateUserPayState?userId=' + row.id + '&action=' + action)
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消操作'
                    });
                    return;
                });
            },
            parsePayUnit(val) {
                if (val == 'DAYS') {
                    return  '天'
                }
                if (val == 'HOURS') {
                    return '小时'
                }
                if (val == 'MINUTES') {
                    return '分钟'
                }
            } 
        }
    }
</script>

<style lang="less" scoped>

</style>
