<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>薪资管理</el-breadcrumb-item>
            <el-breadcrumb-item>我的薪资</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>

            <!--用户列表区域  -->
            <el-table v-loading="loading"
                      :data="userList"
                      border
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="名字" prop="name"></el-table-column>
                <el-table-column label="薪资" prop="salary"></el-table-column>
                <el-table-column label="计薪周期(天)" prop="payDuration"></el-table-column>
                <el-table-column label="链上余额" prop="balance"></el-table-column>
                <el-table-column label="预计下次提薪时间" prop="nextPayTime">
                    <template slot-scope="scope">
                        {{ exchangeTime(scope.row.nextPayTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="confirmSendSalary(scope.row)" v-if="scope.row.salaryEnabled == 1">薪资发放</el-button>
                        <el-button type="danger" size="mini"
                                   @click="showSalaryzStopmsg"  v-if="scope.row.salaryEnabled == 0">薪资已暂停</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                    size: 1000
                },
                loading: false,
                userList: [],
            }
        },
        created() {
            this.getUserSalaryDetail()
        },
        methods: {
            //获取用户列表
            async getUserSalaryDetail() {
                this.loading = true
                const res = await this.$http.get('/employee/getSalaryDetail/', {params: this.queryInfo})
                if (!res) return;
                if (res) {
                    this.userList = res.obj;
                    this.total = res.obj.total;
                }
                this.loading = false
            },
            //分页每页条数
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getUserSalaryDetail()
            },
            //当前也数
            handleCurrentChange(newPage) {
                this.queryInfo.pageNum = newPage;
                this.getUserSalaryDetail();
            },
            //监听添加用户对话框关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
            },
            showSalaryzStopmsg () {
                Message.error({message: '该用户已被暂停发薪'})
            },
            confirmSendSalary (row) {
                MessageBox.confirm('是否确认为 ' + row.name + ' 发放薪资', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = this.$http.get('/employee/postSalary?userId=' + row.id)
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消操作'
                    });
                    return;
                });
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
        }
    }
</script>

<style lang="less" scoped>

</style>
