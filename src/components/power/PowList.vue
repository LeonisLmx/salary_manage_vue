<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!--            添加权限按钮-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              v-model="queryInfo.query"
                              clearable
                              @clear="getAllMenuList" @keyup.enter.native="getAllMenuList">
                        <el-button slot="append" icon="el-icon-search" @click="getAllMenuList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="openAddMenu">添加权限</el-button>
                </el-col>
            </el-row>
            <!--  表格区域-->
            <el-table v-loading="loading"
                      :data="menuInfo"
                      border
                      height="490"
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限级别" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level===0">目录</el-tag>
                        <el-tag type="warning" v-if="scope.row.level===1">菜单</el-tag>
                        <el-tag type="danger" v-if="scope.row.level===2">按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="菜单状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enable" @change="menuEnabledChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="openEditMenu(scope.row)">修改
                        </el-button>
                        <!--删除-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="deleteMenu(scope.row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加权限-->
            <el-dialog
                    title="添加权限"
                    :visible.sync="addMenuDialog"
                    width="30%"
                    @close="addMenuClose"
                    >
                <!--内容主体区域-->
                <el-form
                        :model="addMenu"
                        :rules="addMenuRules"
                        ref="addMenuRef"
                        label-width="90px"
                        @keyup.enter.native="addMenuYes">
                    <el-form-item label="权限名称" prop="name">
                        <el-input v-model="addMenu.name"></el-input>
                    </el-form-item>
                    <el-form-item label="权限路径" prop="pattern">
                        <el-input v-model="addMenu.pattern" placeholder="格式为:/**/**/**"></el-input>
                    </el-form-item>
                    <el-form-item label="访问路径" prop="path">
                        <el-input v-model="addMenu.path" placeholder="格式为:/**"></el-input>
                    </el-form-item>
                    <el-form-item label="权限级别" prop="level">
                        <el-select v-model="addMenu.level" placeholder="请选择">
                            <el-option
                                    v-for="item in levelOptions"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="父级菜单" prop="parentId">
                        <el-select v-model="addMenu.parentId" placeholder="请选择">
                            <el-option
                                    v-for="item in parentIdOptions"
                                    :label="item.name"
                                    :value="item.id"
                                    :key="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单图标">
                        <el-input v-model="addMenu.icon" placeholder="仅支持element组件库中的图标"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addMenuDialog = false">取 消</el-button>
                    <el-button type="primary" @click="addMenuYes" >确 定</el-button>
                 </span>

            </el-dialog>
            <!--修改权限-->
            <el-dialog
                    title="修改权限"
                    :visible.sync="editMenuDialog"
                    width="30%">
                <el-form :model="editMenu"
                         :rules="addMenuRules"
                         ref="editMenuRef"
                         label-width="80px">
                    <el-form-item label="权限名称" prop="name">
                        <el-input v-model="editMenu.name"></el-input>
                    </el-form-item>
                    <el-form-item label="权限路径" prop="name">
                        <el-input v-model="editMenu.pattern"></el-input>
                    </el-form-item>
                    <el-form-item label="访问路径" prop="name">
                        <el-input v-model="editMenu.path"></el-input>
                    </el-form-item>
                    <el-form-item label="权限图标">
                        <el-input v-model="editMenu.icon"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="editMenuDialog = false">取 消</el-button>
                    <el-button type="primary" @click="ediMenuYes">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {Message, MessageBox} from "element-ui";

    export default {
        data() {
            return {
                queryInfo:{
                  query:''
                },
                loading: false,
                menuInfo: [],
                addMenuDialog: false,
                addMenu: {
                    name: '',
                    pattern: '',
                    level: null,
                    path: '',
                    parentId: null,
                    enable: false,
                    icon: 'el-icon-menu'
                },
                addMenuRules: {
                    name: [{required: true, message: '请填写权限名称', trigger: 'blur'}],
                    pattern: [{required: true, message: '请填写权限路径', trigger: 'blur'}],
                    path: [{required: true, message: '请填写访问路径', trigger: 'blur'}],
                    level: [{required: true, message: '请选择权限级别', trigger: 'change'}],
                    parentId:[{required: true, message: '请选择父级菜单', trigger: 'change'}]

                },
                levelOptions: [
                    {
                        label: '目录',
                        value: 0
                    },
                    {
                        label: '菜单',
                        value: 1
                    },
                    {
                        label: '按钮',
                        value: 2
                    }],
                parentIdOptions: [],
                editMenuDialog: false,
                editMenu: {}
            }
        },
        created() {
            this.getAllMenuList()
        },
        methods: {
            async getAllMenuList() {
                this.loading = true
                const res = await this.$http.get('/staff/powList/',{params:this.queryInfo});
                if (!res) return;
                this.menuInfo = res.obj;
                this.loading = false;
            },
            async menuEnabledChanged(menuInfo) {
                const res = await this.$http.put('/staff/changeMenuEnable/' + menuInfo.id + '/' + menuInfo.enable)
                if (!res) {
                    menuInfo.enable = !menuInfo.enable;
                }
                location.reload();
            },
            openAddMenu() {
                this.addMenuDialog = true;
                const arr = [{
                    name: '无',
                    id: 1
                }];
                for (let i = 0; i < this.menuInfo.length; i++) {
                    if (this.menuInfo[i].level!==2) {
                        arr.push(this.menuInfo[i])
                    }
                }
                this.parentIdOptions = arr;
                // console.log(this.parentIdOptions);
            },
            addMenuClose() {
                // const addMenuClose = {
                //     name: '',
                //     pattern: '',
                //     level: null,
                //     path: '',
                //     parentId: null,
                //     enable: false,
                //     icon: 'el-icon-menu'
                // };
                // this.addMenu = addMenuClose;
                this.$refs.addMenuRef.resetFields();
            },
            addMenuYes() {
                this.$refs.addMenuRef.validate(async valid => {
                    if (!valid) {
                        return;
                    }
                    const res = await this.$http.post('/staff/addPow', this.addMenu)
                    if (!res) return;
                    this.getAllMenuList();
                    this.addMenuDialog = false;
                })
            },
            deleteMenu(MenuId) {
                MessageBox.confirm('此操作将永久删除权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const res = this.$http.delete('/staff/deletePow/' + MenuId);
                    this.getAllMenuList();
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    return;
                });
            },
            openEditMenu(MenuInfo) {
                this.editMenuDialog = true;
                this.editMenu = MenuInfo;
            },
            ediMenuYes(){
                this.$refs.editMenuRef.validate(async valid => {
                    if (!valid) return ;
                    const res=await this.$http.put('/staff/editPow',this.editMenu);
                    if (!res) return ;
                    this.getAllMenuList();
                    this.editMenuDialog=false;
                    location.reload();
                })
            },

        }
    }
</script>

<style scoped>

</style>
