<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>假期管理</el-breadcrumb-item>
            <el-breadcrumb-item>假期审批</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <!--用户列表区域  -->
            <el-table v-loading="loading"
                      :data="holidayList"
                      border
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="请假开始时间" prop="holidayStartTime">
                    <template slot-scope="scope">
                        {{ parseTime(scope.row.holidayStartTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="请假结束时间" prop="holidayEndTime">
                    <template slot-scope="scope">
                        {{ parseTime(scope.row.holidayEndTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="是否审批通过" prop="approval">
                    <template slot-scope="scope">
                        {{ approval(scope.row.approval)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="approvalHoliday(scope.row)" v-if="scope.row.approval == 0"></el-button>
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

            
            <el-dialog
                    title="假期审批"
                    :visible.sync="holidayManageVisible"
                    width="50%">
                <div>
                    是否审批通过当前假期申请？
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="holidayManageVisible= false">取 消</el-button>
                <el-button type="primary" @click="holidayManageOperate(1)">确 定</el-button>
                <el-button type="primary" @click="holidayManageOperate(-1)">拒 绝</el-button>
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
                holidayList: [],
                total: 1,
                loading: false,
                //修改用户对话框
                holidayManageVisible: false,
                editUser: {
                    id: 1,
                    username: '',
                    salary: '',
                },
                holidayData: {}
            }
        },
        created() {
            this.getHolidayList()
        },
        methods: {
            //获取用户列表
            async getHolidayList() {
                this.loading = true
                const res = await this.$http.get('/holiday/list/', {params: this.queryInfo})
                if (!res) return;
                if (res) {
                    this.holidayList = res.obj.records;
                    this.total = res.obj.total;
                }
                this.loading = false
            },
            //分页每页条数
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getHolidayList()
            },
            //当前也数
            handleCurrentChange(newPage) {
                this.queryInfo.pageNum = newPage;
                this.getHolidayList();
            },
            //监听添加用户对话框关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
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
            approval(val) {
                return val == 0?'未审批':val == 1?'审批通过':'审批拒绝';
            },
            approvalHoliday(val) {
                this.holidayManageVisible = true;
                this.holidayData = val;
            },
            async holidayManageOperate(val) {
                var params = {
                    "userId": this.holidayData.userId,
                    "id": this.holidayData.id,
                    "action": val
                }
                const res = await this.$http.get('/holiday/approval/', {params: params}
                )
                console.log(res)
                this.holidayData = {}
                this.holidayManageVisible = false;
                this.getHolidayList();
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
