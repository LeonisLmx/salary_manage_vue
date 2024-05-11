<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>薪资管理</el-breadcrumb-item>
            <el-breadcrumb-item>薪资详情</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>

            <!--用户列表区域  -->
            <el-table v-loading="loading"
                      :data="userList"
                      border
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="员工姓名" prop="name"></el-table-column>
                <el-table-column label="发放薪资" prop="salary"></el-table-column>
                <el-table-column label="链上交易哈希" prop="hashId"></el-table-column>
                <el-table-column label="发放时间" prop="createTime"></el-table-column>

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
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            //获取用户列表
            async getUserList() {
                this.loading = true
                const res = await this.$http.get('/employee/getBalanceDetails/', {params: this.queryInfo})
                if (!res) return;
                if (res) {
                    this.userList = res.obj.records;
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
                
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
