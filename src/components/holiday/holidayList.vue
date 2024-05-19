<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>假期管理</el-breadcrumb-item>
            <el-breadcrumb-item>我的假期记录</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <!--搜索与添加区域-->
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" @click="applyHoliday">假期申请</el-button>
                </el-col>
            </el-row>

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
                <el-table-column label="请假持续时长(分)" prop="holidayDurationMinutes">
                </el-table-column>
                <el-table-column label="是否审批通过" prop="approval">
                    <template slot-scope="scope">
                        {{ approval(scope.row.approval)}}
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
                    title="假期申请"
                    :visible.sync="holidayVisible"
                    width="50%">
                    <el-date-picker
                        v-model="dateValue"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="假期开始日期"
                        end-placeholder="假期结束日期"
                        format="yyyy-MM-dd HH"
                        popper-class="tpc"
                        :default-time="['09:00:00', '17:00:00']"
                        :picker-options="pickerOptions">
                        </el-date-picker>
                    <br>
                    <div>上班时间默认为9:00-5:00,每日请假时间应在此区间之内</div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="holidayVisible = false">取 消</el-button>
                <el-button type="primary" @click="holidayApply">确 定</el-button>
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
                holidayList: [],
                total: 1,
                loading: false,
                holidayVisible: false,
                dateValue: '',
                works: [],
                holidays: [],
                pickerOptions: {
                    disabledDate: this.disabledDate
                }
            }
        },
        created() {
            this.getHolidayConfigs()
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
            async getHolidayConfigs() {
                this.loading = true
                const res = await this.$http.get('/holiday/getConfigs/', {params: this.queryInfo})
                if (!res) return;
                if (res) {
                    this.works = res.obj.works;
                    this.holidays = res.obj.holidays;
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
            applyHoliday() {
                this.holidayVisible = true
                this.dateValue = ''
            },
            approval(val) {
                return val == 0?'未审批':val == 1?'审批通过':'审批拒绝';
            },
            async holidayApply() {
                if (this.dateValue == ''){
                    Message.error({message: '时间不能为空'})
                    return
                }
                if (this.dateValue[0].getHours() < 9 || this.dateValue[0].getHours() > 17){
                    Message.error({message: '假期开始时间应该9:00~17:00'})
                    return
                }
                if (this.dateValue[1].getHours() < 9 || this.dateValue[1].getHours() > 17){
                    Message.error({message: '假期结束时间应该9:00~17:00'})
                    return
                }
                var startTime = this.dateValue[0].getTime();
                var endTime = this.dateValue[1].getTime();
                var params = {
                    "startTime": startTime,
                    "endTime": endTime
                }
                const res = await this.$http.get('/holiday/insert/', {params: params})
                if (res.msg == '请假成功'){
                    this.holidayVisible = false
                    this.getHolidayList()
                }
            },
            disabledDate(date) {
                 // 获取今天的日期
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                // 将要比较的日期设为今天之后的日期
                const compareDate = new Date(date);
                compareDate.setHours(0, 0, 0, 0);
                // 禁用今天之后的日期
                const dayOfWeek = compareDate.getDay();
                return compareDate < today 
                || 
                ((dayOfWeek == 0 || dayOfWeek == 6) && this.works.indexOf(compareDate.getTime()) == -1)
                ||
                (this.holidays.indexOf(compareDate.getTime()) > 0);
            }
        }
    }
</script>

<style>
.tpc .el-time-spinner__wrapper {
  width:100% !important;
}
.tpc .el-scrollbar:nth-of-type(2) {
  display: none !important;
}
</style>

